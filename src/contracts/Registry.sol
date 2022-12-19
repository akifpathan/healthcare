// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "./Certificate.sol";

contract Registry {
    using Counters for Counters.Counter;

    Counters.Counter cnt;
    address certContract;
    


    struct CertificateInfo{
        uint id;
        address owner; //address of the owner
        address issuer; //address of the issuer
        string courseTitle; //title of the course
        string ownerName; //name of the owner
        string issuerName; //name of the issuer
        bool verified; //verification status
    }

    mapping(uint256 => CertificateInfo) certificates;

    constructor(address _certContract){
        cnt.reset();
        certContract = _certContract;
    }


    function addCertifcate(
        address _issuerAccount,
        string memory _courseTitle,
        string memory _ownerName,
        string memory _issuerName
    ) public {
        uint cid = cnt.current();
        cnt.increment();

        // store onwnership
        Certificate(certContract).safeMint(msg.sender, cid); // address

        CertificateInfo memory cert = CertificateInfo(
            cid,
            msg.sender,
            _issuerAccount,
            _courseTitle,
            _ownerName,
            _issuerName,
            false
        );

        certificates[cid] = cert;
    }

    /*
    return all the certificates owned by msg.sender
    */
    function getCertificates() public view returns (CertificateInfo[] memory){
        
        CertificateInfo[] memory result = new CertificateInfo[](cnt.current());

        for (uint i=0; i < cnt.current(); i++){
            result[i] = certificates[i];
        }
        return result;
    }

    function getCertificate(uint cid) public view returns (CertificateInfo memory) {
        return certificates[cid];
    }


    function verify(uint cid) public{ 
        require( certificates[cid].issuer  == msg.sender,
            "Only issuer can verify a certificate"
        );         
    
        certificates[cid].verified = true;
    }

    function strcmp(string memory s1, string memory s2) public pure returns(bool){
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }


    function checkVerified(
        uint cid,
        string memory _ownerName,
        string memory _issuerName
    ) public view returns (bool) {
        //console.log(cid, _ownerName, _issuerName);
        if(cid >= cnt.current()){
            console.log("certificate doesn't exist");
            return false;
        }

        if(!certificates[cid].verified){
            console.log("certificate is not verified yet");
            return false;
        }

        if(!strcmp(_ownerName, certificates[cid].ownerName)){
            console.log("Invalid owner");
            return false;
        }

        if(!strcmp(_issuerName, certificates[cid].issuerName)){
            console.log("Invalid issuer");
            return false;
        }
        return true;
    }


    struct StudentInfo{
        address studentAccount;
        string courseTitle;
        uint fee;
    }

    mapping(address => StudentInfo[]) students; 
    address[] studentAccounts;

    function addFee(string memory courseTitle, address payable receiver) public payable{
        require(msg.value>=0, "Insufficient Amount");
        StudentInfo memory si = StudentInfo(msg.sender, courseTitle, msg.value);
        students[msg.sender].push(si);
        receiver.transfer(msg.value);
    }

    function getStudentInfo() public view returns (StudentInfo[] memory){
        return students[msg.sender];
    }
}