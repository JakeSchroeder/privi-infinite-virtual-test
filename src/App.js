import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import faker from "faker"
import logo from './logo.svg';
import { getUser } from "./fakeData";


import { Scrollbars } from "react-custom-scrollbars";
import { IonContent, IonPage, IonList, IonItem } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


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


const UserItem = ({ user, index }) => {

  return <li key={index} style={{ height: `${user.height}px`, background: '#e0e0e0' }}>index: {index} | {user.name}</li>
}

const App = ({ MessageInput }) => {
  const [loading, setLoading] = useState(true);
  let oldTotalHeight = useRef(0);
  let newTotalHeight = useRef(0);
  const initialIndexOffset = useRef(1000)
  const [users, setUsers] = useState(
    Array(20)
      .fill(true)
      .map((_, index) => getUser(index))
  )

  let containerRef = useRef(null)
  let listRef = useRef(null);



  useEffect(() => {
    if (containerRef) {
      containerRef.current.scrollToBottom()
    }

  }, [containerRef])



  const loadMore = useCallback(async () => {
    const usersToPrepend = 20;

    initialIndexOffset.current -= usersToPrepend

    setLoading(false);

    if (listRef) {

      oldTotalHeight.current = listRef.current.clientHeight;
      console.log(oldTotalHeight)
    }

    await setUsers([
      ...Array(usersToPrepend)
        .fill(true)
        .map((_, index) =>
          getUser(initialIndexOffset.current + index)
        ),
      ...users,
    ])

    return false;

  }, [users, setUsers, initialIndexOffset])

  //after render
  useEffect(() => {
    //TODO fix render twice should be once.
    if (!loading) {
      newTotalHeight.current = listRef.current.clientHeight;
      console.log("Old Height" + oldTotalHeight.current)
      console.log("New Height" + newTotalHeight.current)
      if (oldTotalHeight.current < newTotalHeight.current) {
        let dif = newTotalHeight.current - oldTotalHeight.current;
        containerRef.current.scrollByPoint(0, dif, 0);
      }
    }
  })


  return (
    <IonPage>
      <div style={{ height: "400px", display: "flex" }}>
        <IonContent ref={ref => containerRef.current = ref} scrollEvents={true} onIonScroll={(e) => {
          console.log(e.detail.scrollTop);
          if (e.detail.scrollTop <= 400) {

            if (loading) {
              loadMore();
            }
          }
        }}>
          <IonList ref={ref => listRef.current = ref}>
            {users.map((user, index) => (
              <IonItem key={index} style={{ height: `${user.height}px` }}><p style={{ background: `#${user.bg}` }}>{user.name}</p></IonItem>
            ))}
          </IonList>

        </IonContent>
        <div>
          Item Count:{users.length}
        </div>
      </div>
    </IonPage>
  )
}


export default App;











// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import './App.css';
// import faker from "faker"
// import logo from './logo.svg';
// import { getUser } from "./fakeData";
// import { Virtuoso } from 'react-virtuoso';


// import { Scrollbars } from "react-custom-scrollbars";


// const CustomScrollContainer = ({
//   className,
//   style,
//   reportScrollTop,
//   scrollTo,
//   children,
// }) => {

//   let elRef = useRef(null);

//   scrollTo(scrollTop => {
//     elRef.current.scrollTop(scrollTop.top);
//     console.log(scrollTop);
//   })

//   return (
//     <Scrollbars tabIndex={0} className={className} ref={elRef} onScroll={e => reportScrollTop(e.target.scrollTop)} style={{ width: '350px', height: '200px' }} autoHide>
//       {children}
//     </Scrollbars>
//   )
// }


// const UserItem = ({ user, index }) => {

//   return <li key={index} style={{ height: `${user.height}px`, background: '#e0e0e0' }}>index: {index} | {user.name}</li>
// }

// const App = ({ MessageInput }) => {
//   const loading = useRef()
//   const virtuoso = useRef(null)
//   const [visibleRange, setVisibleRange] = useState([0, 0])
//   const initialIndexOffset = useRef(1000)

//   const [users, setUsers] = useState(
//     Array(100)
//       .fill(true)
//       .map((_, index) => getUser(index))
//   )

//   const prependItems = useCallback(() => {
//     const usersToPrepend = 25
//     initialIndexOffset.current -= usersToPrepend
//     setUsers([
//       ...Array(usersToPrepend)
//         .fill(true)
//         .map((_, index) =>
//           getUser(initialIndexOffset.current + index)
//         ),
//       ...users,
//     ])
//     virtuoso.current.adjustForPrependedItems(usersToPrepend)
//     return false
//   }, [initialIndexOffset, users, setUsers])


//   //  use this for prefetching items but causes wrong scroll bottom when it intializes.
//   // useEffect(() => {
//   //   if (visibleRange[0] <= 30) {
//   //     prependItems();
//   //   }
//   // }, [visibleRange])

//   return (
//     <div>
//       <Virtuoso
//         initialTopMostItemIndex={initialIndexOffset.current}
//         ScrollContainer={CustomScrollContainer}
//         ref={virtuoso}

//         rangeChanged={({ startIndex, endIndex }) => {
//           setVisibleRange([startIndex, endIndex])
//         }}
//         startReached={() => {
//           prependItems();
//         }}
//         totalCount={users.length}
//         item={(index) => <UserItem user={users[index]} index={index} />}
//       // overscan={25}
//       // scrollSeek={{
//       //   enter: velocity => Math.abs(velocity) > 600,
//       //   exit: velocity => {
//       //     const shouldExit = Math.abs(velocity) < 300
//       //     if (shouldExit) {
//       //       setVisibleRange(['-', '-'])
//       //     }
//       //     return shouldExit
//       //   },
//       //   change: (_velocity, { startIndex, endIndex }) =>
//       //     setVisibleRange([startIndex, endIndex]),
//       //   // You can use index to randomize
//       //   // and make the placeholder list more organic.
//       //   placeholder: ({ height, index }) => (
//       //     <div
//       //       style={{

//       //         backgroundColor: '#e0e0e0',
//       //         padding: '8px',
//       //         boxSizing: 'border-box',
//       //         overflow: 'hidden',
//       //       }}
//       //     >
//       //       <div
//       //         style={{
//       //           background: '#ccc',
//       //           height: "50px",
//       //         }}
//       //       ></div>
//       //     </div>
//       //   ),
//       // }}

//       />
//       <h2>Item count: {users.length}</h2>
//       <div>
//         <strong>
//           {visibleRange[0]} - {visibleRange[1]}
//         </strong>
//       </div>
//       <div>
//         <button onClick={() => {
//           if (users.length >= 100)
//             virtuoso.current.scrollToIndex(100);
//         }}>Scroll to 100</button>
//         <button onClick={() => {
//           if (users.length >= 200)
//             virtuoso.current.scrollToIndex(200);
//         }}>Scroll to 200</button>
//       </div>
//       <div>
//         <MessageInput onSubmit={async (value) => {
//           console.log(value);
//           await setUsers([...users, { message: value }]);
//           console.log(users.length);
//           virtuoso.current.scrollToIndex(users.length)
//         }} />
//       </div>
//     </div>
//   )
// }


// export default App;

