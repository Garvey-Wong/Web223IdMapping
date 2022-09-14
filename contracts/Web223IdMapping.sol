//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Web223IdMapping {
    enum CodeStatus {
        NONE,
        NOT_USED,
        USED
    }

    struct Orgization {
        bool valid;
        string name;
        address[] members;
        mapping(address => bool) admins;
        mapping(bytes32 => address) code2MemberMap;
        mapping(address => bytes32) member2CodeMap;
        mapping(bytes32 => CodeStatus) codeStatuses;
    }

    mapping(string => Orgization) private _orgs;
    string[] private _orgNames;
    mapping(address => string[]) private _admin2Orgs;
    mapping(address => string[]) private _member2Orgs;

    function putCode(string memory orgName, bytes32 hashedCode)
        public
        adminOnly(orgName)
        returns (bool)
    {
        Orgization storage org = _orgs[orgName];
        require(
            org.codeStatuses[hashedCode] == CodeStatus.NONE,
            "Duplicate code"
        );
        org.codeStatuses[hashedCode] = CodeStatus.NOT_USED;
        return true;
    }

    function putCodes(string memory orgName, bytes32[] memory hashedCodes)
        public
        adminOnly(orgName)
        returns (bool)
    {
        Orgization storage org = _orgs[orgName];
        for (uint32 i = 0; i < hashedCodes.length; ) {
            bytes32 hashedCode = hashedCodes[i];
            if (org.codeStatuses[hashedCode] == CodeStatus.NONE) {
                org.codeStatuses[hashedCode] = CodeStatus.NOT_USED;
            }
            unchecked {
                i += 1;
            }
        }
        return true;
    }

    function memberRegister(string memory orgName, string memory code)
        public
        returns (bool)
    {
        Orgization storage org = _orgs[orgName];
        require(org.member2CodeMap[msg.sender] == 0, "already verified");

        bytes32 hashedCode = keccak256(abi.encodePacked(code));
        require(
            org.codeStatuses[hashedCode] == CodeStatus.NOT_USED,
            "Invalid code"
        );

        org.codeStatuses[hashedCode] = CodeStatus.USED;
        org.code2MemberMap[hashedCode] = msg.sender;
        org.member2CodeMap[msg.sender] = hashedCode;
        org.members.push(msg.sender);

        _member2Orgs[msg.sender].push(orgName);
        return true;
    }

    function orgRegister(string memory orgName) public returns (bool) {
        require(!_orgs[orgName].valid, "organization exists");
        Orgization storage org = _orgs[orgName];
        org.valid = true;
        org.name = orgName;
        org.admins[msg.sender] = true;

        _orgNames.push(orgName);
        _admin2Orgs[msg.sender].push(orgName);
        return true;
    }

    function addAdmin(string memory orgName, address addr)
        public
        adminOnly(orgName)
        returns (bool)
    {
        Orgization storage org = _orgs[orgName];
        require(msg.sender != addr && !org.admins[addr], "Duplicate admin");
        org.admins[addr] = true;
        _admin2Orgs[addr].push(orgName);
        return true;
    }

    function verify(string memory orgName, address addr)
        public
        view
        returns (bool)
    {
        return _orgs[orgName].member2CodeMap[addr] > 0;
    }

    function getManagedOrgNames() public view returns (string[] memory) {
        return _admin2Orgs[msg.sender];
    }

    function getJoinedOrgs() public view returns (string[] memory) {
        return _member2Orgs[msg.sender];
    } 

    function getAllOrgNames() public view returns (string[] memory) {
        return _orgNames;
    }

    function getMembers(string memory orgName)
        public
        view
        returns (address[] memory)
    {
        return _orgs[orgName].members;
    }

    modifier adminOnly(string memory orgName) {
        require(_orgs[orgName].admins[msg.sender], "Admin only");
        _;
    }

    // for Debug
    function getHash(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(text));
    }
}
