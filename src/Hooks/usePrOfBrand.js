import React, {useState, useEffect} from 'react';
import fireDb from '../firebase';

function usePrOfBrand (type, brand) {
  
    const [limit, setLimit] = useState(0);
    const [allPr, setAllPr] = useState([]);
    const [cloneAllPr, setCloneAllPr] = useState([]);
    const [unlock, setUnlock] = useState(false);
    
    useEffect(()=>{
      fireDb.ref(type).orderByChild('public').equalTo(true).once('value', getPr);
    },[brand]);

    function getPr (snapshot) {
      const data = [];
      snapshot.forEach((item)=>{
        let key = item.key;
        let val = item.val();
        if (val.brand === brand) {
            data.push({...val, key: key });
        }
      });
      setAllPr(data);
      setCloneAllPr(data.reverse());
      setLimit(10);
      setUnlock(false);
    }

    const [pr, setPr] = useState([]);
    
    useEffect(()=>{
      setPr(cloneAllPr.slice(0,limit));
    },[limit]);

    useEffect (()=>{
      setPr(cloneAllPr.slice(0, limit));
    }, [cloneAllPr]);
  
    function handleSeeMore () {
      setLimit(limit + 10);
    }

    function setPrConditional (data) {
      let id1 = document.getElementById('sort-item-1');
      let id2 = document.getElementById('sort-item-2');
      id1.style.color = '#404040';
      id2.style.color = '#404040';

      for (let i = 0; i <= 4; i++) {
        let j = i.toString();
        if (data.key === j) {
          document.getElementById("filter-prices-a-active" + j).style.fontWeight = '700';
        } else {
          document.getElementById("filter-prices-a-active" + j).style.fontWeight = '400';
        }
      }

      let price = data.value;
      let type = data.type;
      if (price.length === 1 && type === 'under') {
        
        const output = [];
        allPr.forEach((item)=>{
          let num = Number(item.price);
          if (num <= price[0]) {
            output.push(item);
          }
        });
        if (output.length === [].length) {
          setCloneAllPr(output);
          setUnlock(true);
        } else {
          setCloneAllPr(output);
          setUnlock(false);
          setLimit(10);
        }
      }

      if (price.length === 1 && type === 'over') {
        const output = [];
        allPr.forEach((item)=>{
          let num = Number(item.price);
          if (num >= price[0]) {
            output.push(item);
          }
        });
        if (output.length === [].length) {
          setCloneAllPr(output);
          setUnlock(true);
        } else {
          setCloneAllPr(output);
          setUnlock(false);
          setLimit(10);
        }
      }

      if (price.length === 2 && type === 'limit') {
        
        const star = price[0];
        const end = price[1];
        const output = [];
        allPr.forEach((item)=>{
          let num = Number(item.price);
          if (num >= star && num <= end) {
            output.push(item);
          }
        });
        if (output.length === [].length) {
          setCloneAllPr(output);
          setUnlock(true);
        } else {
          setCloneAllPr(output);
          setUnlock(false);
          setLimit(10);
        }
      }
    }

    function lowToHigh () {
      let id1 = document.getElementById('sort-item-1');
      let id2 = document.getElementById('sort-item-2');
      id1.style.color = '#0077ff';
      id2.style.color = '#404040';

      let tmp;
      for (let i = 0; i < cloneAllPr.length - 1; i++) {
        for (let j = i + 1; j < cloneAllPr.length; j++) {
          if (Number(cloneAllPr[i].price) > Number(cloneAllPr[j].price)) {
            tmp = cloneAllPr[i];
            cloneAllPr[i] = cloneAllPr[j]
            cloneAllPr[j] = tmp;
          }
        }
      }
      const newArr = [...cloneAllPr];
      setCloneAllPr(newArr);
    }

    function highToLow () {
      let id1 = document.getElementById('sort-item-1');
      let id2 = document.getElementById('sort-item-2');
      id1.style.color = '#404040';
      id2.style.color = '#0077ff';
      let tmp;
      for (let i = 0; i < cloneAllPr.length - 1; i++) {
        for (let j = i + 1; j < cloneAllPr.length; j++) {
          if (Number(cloneAllPr[i].price) < Number(cloneAllPr[j].price)) {
            tmp = cloneAllPr[i];
            cloneAllPr[i] = cloneAllPr[j]
            cloneAllPr[j] = tmp;
          }
        }
      }
      const newArr = [...cloneAllPr];
      setCloneAllPr(newArr);
    }

    return [
      cloneAllPr, pr, handleSeeMore, limit, setPrConditional, lowToHigh,
      highToLow, unlock
    ];
}

export default usePrOfBrand;