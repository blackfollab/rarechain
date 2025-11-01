// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NodeInvestment {
    address public owner;
    bool public paused;

    struct Plan {
        uint duration;
        uint roi; // ROI in basis points (e.g., 80 = 0.8%)
        uint min;
        uint max;
        uint fee;
    }

    struct Investment {
        uint planId;
        uint amount;
        uint startTime;
        bool withdrawn;
        bool completed;
    }

    mapping(uint => Plan) public plans;
    mapping(address => Investment[]) public userInvestments;

    event Invested(address indexed user, uint planId, uint amount, uint timestamp);
    event Withdrawn(address indexed user, uint amount, bool completed);
    event PlanUpdated(uint planId, Plan plan);
    event Paused(bool status);
    event OwnerWithdrawal(uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
        paused = false;

        // Default plans
        plans[1] = Plan(240 days, 80, 100000 ether, 180000 ether, 50);
        plans[2] = Plan(240 days, 50, 50000 ether, 99000 ether, 40);
        plans[3] = Plan(365 days, 40, 10000 ether, 49999 ether, 40);
        plans[4] = Plan(365 days, 30, 100 ether, 9999 ether, 40);
        plans[5] = Plan(120 days, 100, 200000 ether, type(uint).max, 40);
    }

    function setPlan(
        uint planId,
        uint duration,
        uint roi,
        uint min,
        uint max,
        uint fee
    ) external onlyOwner {
        plans[planId] = Plan(duration, roi, min, max, fee);
        emit PlanUpdated(planId, plans[planId]);
    }

    function pause(bool status) external onlyOwner {
        paused = status;
        emit Paused(status);
    }

    function invest(uint planId) external payable notPaused {
        Plan memory plan = plans[planId];
        require(plan.duration > 0, "Invalid plan");
        require(msg.value >= plan.min && msg.value <= plan.max, "Invalid investment amount");

        Investment memory newInvestment = Investment({
            planId: planId,
            amount: msg.value,
            startTime: block.timestamp,
            withdrawn: false,
            completed: false
        });

        userInvestments[msg.sender].push(newInvestment);
        emit Invested(msg.sender, planId, msg.value, block.timestamp);
    }

    function withdraw(uint index) public notPaused {
        require(index < userInvestments[msg.sender].length, "Invalid index");
        Investment storage inv = userInvestments[msg.sender][index];
        require(!inv.withdrawn, "Already withdrawn");

        Plan storage plan = plans[inv.planId];
        uint payout;

        if (block.timestamp >= inv.startTime + plan.duration) {
            uint fullReturn = inv.amount + ((inv.amount * plan.roi * plan.duration) / (10000 * 1 days));
            payout = fullReturn;
            inv.completed = true;
        } else {
            uint fee = (inv.amount * plan.fee) / 100;
            payout = inv.amount - fee;
        }

        inv.withdrawn = true;
        payable(msg.sender).transfer(payout);
        emit Withdrawn(msg.sender, payout, inv.completed);
    }

    function withdrawAll() external notPaused {
        Investment[] storage invList = userInvestments[msg.sender];
        for (uint i = 0; i < invList.length; i++) {
            if (!invList[i].withdrawn) {
                withdraw(i);
            }
        }
    }

    function getInvestments(address user) external view returns (Investment[] memory) {
        return userInvestments[user];
    }

    function getPlan(uint planId) external view returns (Plan memory) {
        return plans[planId];
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function withdrawBNB(uint amount) external onlyOwner {
        require(amount <= address(this).balance, "Not enough balance");
        payable(owner).transfer(amount);
        emit OwnerWithdrawal(amount);
    }

    function withdrawAllBNB() external onlyOwner {
        uint balance = address(this).balance;
        payable(owner).transfer(balance);
        emit OwnerWithdrawal(balance);
    }

    receive() external payable {}
}