pragma solidity ^0.5.0;

contract Univ {
    struct StudentDetails {
        uint id;
        string name;
        string ipfsHash;
    }
    
    mapping(address => bool) public certified;
    mapping(uint => StudentDetails) public studentsdetails;

    uint public studentsCount;
    
    function upload (string memory _name, address  _addressid, string memory _ipfsHash) public {

        // require(!certified[_addressid]);
        studentsCount ++;
        studentsdetails[studentsCount] = StudentDetails(studentsCount, _name, _ipfsHash);
        certified[_addressid] = true;
    }
}