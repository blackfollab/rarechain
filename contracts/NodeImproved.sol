// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NodeInvestment is Ownable, ReentrancyGuard {
    address public receiver;
    bool public paused;

    struct Plan {
        uint256 duration;
        uint256 roi; // ROI in basis points (e.g., 80 = 0.8%)
        uint256 min;
        uint256 max;
        uint256 fee;
    }

    struct Investment {
        uint256 planId;
        uint256 amount;
        uint256 startTime;
        bool withdrawn;
        bool completed;
    }

    mapping(uint256 => Plan) public plans;
    mapping(address => Investment[]) public userInvestments;

    event Invested(address indexed user, uint256 planId, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, bool completed);
    event PlanUpdated(uint256 planId, Plan plan);
    event Paused(bool status);
    event OwnerWithdrawal(uint256 amount);
    event ReceiverUpdated(address newReceiver);

    constructor(address initialOwner, address _receiver) Ownable(initialOwner) {
        require(_receiver != address(0), "Invalid receiver address");
        receiver = _receiver;

        // Default plans
        plans[1] = Plan(240 days, 80, 100 ether, 180 ether, 50);
        plans[2] = Plan(240 days, 50, 50 ether, 99 ether, 40);
        plans[3] = Plan(365 days, 40, 10 ether, 49 ether, 40);
        plans[4] = Plan(365 days, 30, 1 ether, 9 ether, 40);
        plans[5] = Plan(120 days, 100, 200 ether, type(uint256).max, 40);
    }

    function setReceiver(address _receiver) external onlyOwner {
        require(_receiver != address(0), "Invalid address");
        receiver = _receiver;
        emit ReceiverUpdated(_receiver);
    }

    function setPlan(
        uint256 planId,
        uint256 duration,
        uint256 roi,
        uint256 min,
        uint256 max,
        uint256 fee
    ) external onlyOwner {
        plans[planId] = Plan(duration, roi, min, max, fee);
        emit PlanUpdated(planId, plans[planId]);
    }

    function pause(bool status) external onlyOwner {
        paused = status;
        emit Paused(status);
    }

    function invest(uint256 planId) external payable nonReentrant whenNotPaused {
        Plan memory plan = plans[planId];
        require(plan.duration > 0, "Invalid plan");
        require(msg.value >= plan.min && msg.value <= plan.max, "Invalid investment amount");

        // Forward funds to receiver
        (bool sent, ) = payable(receiver).call{value: msg.value}("");
        require(sent, "Transfer to receiver failed");

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

    function withdraw(uint256 index) public nonReentrant whenNotPaused {
        require(index < userInvestments[msg.sender].length, "Invalid index");
        Investment storage inv = userInvestments[msg.sender][index];
        require(!inv.withdrawn, "Already withdrawn");

        Plan storage plan = plans[inv.planId];
        uint256 payout;

        if (block.timestamp >= inv.startTime + plan.duration) {
            uint256 fullReturn = inv.amount + ((inv.amount * plan.roi * plan.duration) / (10000 * 1 days));
            payout = fullReturn;
            inv.completed = true;
        } else {
            uint256 fee = (inv.amount * plan.fee) / 100;
            payout = inv.amount - fee;
        }

        inv.withdrawn = true;

        require(address(this).balance >= payout, "Insufficient contract balance");
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, payout, inv.completed);
    }

    function withdrawAll() external nonReentrant whenNotPaused {
        Investment[] storage invList = userInvestments[msg.sender];
        for (uint256 i = 0; i < invList.length; i++) {
            if (!invList[i].withdrawn) {
                withdraw(i);
            }
        }
    }

    function getInvestments(address user) external view returns (Investment[] memory) {
        return userInvestments[user];
    }

    function getPlan(uint256 planId) external view returns (Plan memory) {
        return plans[planId];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawBNB(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Not enough balance");
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Transfer failed");
        emit OwnerWithdrawal(amount);
    }

    function withdrawAllBNB() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
        emit OwnerWithdrawal(balance);
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    receive() external payable {}
}
