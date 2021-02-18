pragma solidity ^0.5.0;

contract Storage {
  string storageData;

  function set(string memory _storageData) public {
    storageData = _storageData;
  }

  function get() public view returns (string memory) {
    return storageData;
  }
}
