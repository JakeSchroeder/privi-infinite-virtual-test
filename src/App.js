import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import faker from "faker"
import logo from './logo.svg';
import { getUser } from "./fakeData";
import { Virtuoso } from 'react-virtuoso';


import { Scrollbars } from "react-custom-scrollbars";


const CustomScrollContainer = ({
  className,
  style,
  reportScrollTop,
  scrollTo,
  children,
}) => {

  let elRef = useRef(null);

  scrollTo(scrollTop => {
    elRef.current.scrollTop(scrollTop.top);
    console.log(scrollTop);
  })

  return (
    <Scrollbars tabIndex={0} className={className} ref={elRef} onScroll={e => reportScrollTop(e.target.scrollTop)} style={{ width: '350px', height: '200px' }} autoHide>
      {children}
    </Scrollbars>
  )
}


const GenerateItem = index => {
  return <li key={index} style={{ height: `${Math.random() * (120 - 50) + 50}px`, background: '#e0e0e0' }}>index: {index} | {getUser(index).name} | {}</li>
}

const App = ({ MessageInput }) => {
  const loading = useRef()
  const virtuoso = useRef(null)
  const [visibleRange, setVisibleRange] = useState([0, 0])
  const initialIndexOffset = useRef(100)

  const [users, setUsers] = useState(
    Array(100)
      .fill(true)
      .map((_, index) => getUser(index).name)
  )

  const prependItems = useCallback(() => {
    const usersToPrepend = 25
    initialIndexOffset.current -= usersToPrepend
    setUsers([
      ...Array(usersToPrepend)
        .fill(true)
        .map((_, index) =>
          getUser(initialIndexOffset.current + index)
        ),
      ...users,
    ])
    virtuoso.current.adjustForPrependedItems(usersToPrepend)
    return false
  }, [initialIndexOffset, users, setUsers])


  // use this for prefetching items but causes wrong scroll bottom when it intializes.
  // useEffect(() => {
  //   if (visibleRange[0] <= 30) {
  //     prependItems();
  //   }
  // }, [visibleRange])

  return (
    <div>
      <Virtuoso
        initialTopMostItemIndex={initialIndexOffset.current}
        ScrollContainer={CustomScrollContainer}
        ref={virtuoso}
        defaultItemHeight={50}
        rangeChanged={({ startIndex, endIndex }) => {
          setVisibleRange([startIndex, endIndex])
        }}
        startReached={() => {
          prependItems();
        }}
        totalCount={users.length}
        item={GenerateItem}
        overscan={25}

      />
      <h2>Item count: {users.length}</h2>
      <div>
        <strong>
          {visibleRange[0]} - {visibleRange[1]}
        </strong>
      </div>
      <div>
        <button onClick={() => {
          virtuoso.current.scrollToIndex(100);
        }}>Scroll to 100</button>
        <button>Scroll to 200</button>
      </div>
      <div>
        <MessageInput onSubmit={async (value) => {
          console.log(value);
          await setUsers([...users, { message: value }]);
          console.log(users.length);
          virtuoso.current.scrollToIndex(users.length)
        }} />
      </div>
    </div>
  )
}


export default App;

