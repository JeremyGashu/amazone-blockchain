// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    string public name;
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;

    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        name = "Dappazon";
        owner = msg.sender;
    }

    // List products
    function list(
        uint256 _id,
        string memory _name,
        string memory _catgory,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // make sure the one in charge of adding items is only the owner

        // Create new item object from params
        Item memory _item = Item(
            _id,
            _name,
            _catgory,
            _image,
            _cost,
            _rating,
            _stock
        );

        // Save the newly created item in our mapping
        items[_id] = _item;

        // emit the List event as the new item is added
        emit List(_name, _cost, _stock);
    }

    // Buy products
    function buy(uint256 _id) public payable {
        Order memory _order = Order(block.timestamp, items[_id]);
    }

    // Withdraw funds
}
