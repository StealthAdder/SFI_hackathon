pragma solidity ^0.5.0;

contract Degree {
    
    struct StudentDetails {
        uint id;
        string name;
        address studentAddress;
    }
    
    struct StudentDegreeDetails {
        uint id;
        string degree_name;
        string year;
        string ipfsHASH;
        address studentAddress;
    }
    
    struct DegreeList {
        address studentAddress;
        uint degreeIDlength;
        uint[] degreeID;
    }
    
    uint[] temp = [1];
    uint count = 0;
    string ok;
    
    mapping(address => bool) public degreeCompleted;
    mapping(address => bool) public registeredStudent;
    mapping(uint => StudentDegreeDetails) public studentdegreedetails;
    mapping(address => StudentDetails) public studentdetail_address;
    mapping(address => DegreeList) public degreelist;

    uint public degreeCounts;
    uint public studentCounts;
    bool public lastupload = false;
    
    function getdegreeIDarr(address _addressid,uint _studentCount) private{
        degreelist[_addressid].degreeIDlength+=1;
        degreelist[_addressid].degreeID.push(_studentCount);
    }
    
    function getarr(address _addressid,uint _degreeID) public view returns (uint ret){
        // uint _degreeID = degreelist[_addressid].degreeIDlength;
        uint _degreeID = uint(degreelist[_addressid].degreeIDlength)-1;
        return degreelist[_addressid].degreeID[_degreeID];
    }
    
    function getname(address _addressid) public view returns (string memory)  {
        return studentdetail_address[_addressid].name;
    }
    
    function checkipfs(uint count,string memory _ipfsHash, address _addressid) public view returns (bool){
        if(degreelist[_addressid].degreeIDlength>0) {
            if(count==degreelist[_addressid].degreeIDlength){
                count=0;
                return false;
            }
            count++;
            if(keccak256(bytes(studentdegreedetails[count].ipfsHASH)) == keccak256(bytes(_ipfsHash))){
                return checkipfs(count,_ipfsHash,_addressid);
            } else {
                return true;
            }
        }
    }

    function admission(string memory _name, address _addressid) public {
        if(!registeredStudent[_addressid]){
            studentCounts++;
            studentdetail_address[_addressid] = StudentDetails(degreeCounts,_name,_addressid);
            registeredStudent[_addressid]=true;
        }
    }
    
    function upload (string memory _degree_name, string memory _year, string memory _ipfsHash, address _addressid) public{
        if(registeredStudent[_addressid]){
            if(!degreeCompleted[_addressid]){
                degreeCounts ++;
                getdegreeIDarr(_addressid,degreeCounts);
                studentdegreedetails[degreeCounts] = StudentDegreeDetails(degreeCounts, _degree_name, _year, _ipfsHash, _addressid);
                degreelist[_addressid] = DegreeList(_addressid, 1,temp);
                degreeCompleted[_addressid]=true;
                lastupload=true;
            }
            else{
                if(checkipfs(count,_ipfsHash,_addressid)){
                    degreeCounts ++;
                    getdegreeIDarr(_addressid,degreeCounts);
                    studentdegreedetails[degreeCounts] = StudentDegreeDetails(degreeCounts, _degree_name, _year, _ipfsHash, _addressid);
                    degreelist[_addressid] = DegreeList(_addressid, degreelist[_addressid].degreeIDlength,degreelist[_addressid].degreeID);
                    lastupload=true;
                } else lastupload=false;
            }
        }
    }
}