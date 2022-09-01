// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/// @title Defi Lottery
/// @author Arty06
import "./ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DefiLottery is ERC721A, Ownable, ReentrancyGuard {

    using Strings for uint256;

    uint public MAX_SUPPLY = 5;

    uint public max_mint_allowed = 5;

    uint public priceSale = 0.0000001 ether;

    string public baseURI;

    string public baseExtension = ".json";

    bool public paused = false;

    uint public saleStartTime = 1661986242;

    enum Steps {
        Before,
        Sale,
        SoldOut
    }

    Steps public sellingStep;
    
    address private _owner;

    mapping(address => uint) nftsPerWallet;

    

    constructor(string memory _theBaseURI) ERC721A("DefiLottery", "DFL") {
        transferOwnership(msg.sender);
        sellingStep = Steps.Sale;
        baseURI = _theBaseURI;
        

    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    function changeMaxMintAllowed(uint _maxMintAllowed) external onlyOwner {
        max_mint_allowed = _maxMintAllowed;
    }

    function changePriceSale(uint _priceSale) external onlyOwner {
        priceSale = _priceSale;
    }

    function setBaseUri(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseExtension(string memory _baseExtension) external onlyOwner {
        baseExtension = _baseExtension;
    }


    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    function setSteps(uint _steps) external onlyOwner {
        sellingStep = Steps(_steps);
    }


    function saleMint(address _account, uint256 _ammount) external payable nonReentrant {
        uint price = priceSale; 
        require(currentTime() >= saleStartTime, "Sale has not started yet");
        require(sellingStep == Steps.Sale, "Sorry, sale has not started yet.");
        require(msg.value >= price * _ammount, "Not enought funds.");
        require(_ammount <= max_mint_allowed, "You can't mint more than X tokens");
        require(totalSupply() + _ammount <= MAX_SUPPLY, "Sale is almost done and we don't have enought NFTs left.");
        if(currentTime() >= saleStartTime + 3000 minutes) {
            sellingStep = Steps.SoldOut;
        }
        _safeMint(_account, _ammount);
    }

    function setSaleStartTime(uint _saleStartTime) external onlyOwner {
        saleStartTime = _saleStartTime;
    }

    function currentTime() internal view returns(uint) {
        return block.timestamp;
    }

    function getBalanceForTheWinner() external view returns(uint) {
        
        return address(this).balance;
    }

    function getWinnerAddress()external view returns(address) {
        uint myNumber;
        myNumber = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp, myNumber))) % totalSupply();
        address winnerAddress = ownerOf(myNumber);
        return winnerAddress;
    }

    function withdrawToWinner() public payable nonReentrant{
        uint myNumber;
        myNumber = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp, myNumber))) % totalSupply();
        address winnerAddress = ownerOf(myNumber);
        require(msg.sender == winnerAddress);
        require(payable(msg.sender).send(address(this).balance));
    }

    function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance*20/100));
    }

}