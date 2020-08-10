contract CounterContract {
  uint public counter;
  function DumbContract() public {
    counter = 0;
  }
  function counterWithOffset(uint offset) public constant returns (uint sum) {
    return counter + offset;
  }
  function countup(uint by) public {
    counter += by;
  }
}
