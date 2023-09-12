import tom from "../../assets/tom.png";
import siji from "../../assets/siji.png";
import xixi from "../../assets/xixi.png";
import cooper from "../../assets/cooper.png";
import jane from "../../assets/jane.png";
export const friends = [
  { name: "Tom", imgSrc: tom, cp: "000003", online: true },
  { name: "Oluwasijibomi", imgSrc: siji, cp: "000003", online: true },
  { name: "Xiximes", imgSrc: xixi, cp: "000003", online: false },
  { name: "Cooper", imgSrc: cooper, cp: "000003", online: false },
  { name: "Jane", imgSrc: jane, cp: "000003", online: false },
];

export const transactions = [
  {
    name: "Tom",
    imgSrc: tom,
    cp: "000003",
    amount: 10,
    status: "Pending",
    time: "8:18am",
    title: "PURCHASE NFT",
    online: true,
  },
  {
    name: "Oluwasijibomi",
    imgSrc: siji,
    cp: "000003",
    amount: 20,
    status: "Successful",
    time: "12th Feb, 2023",
    title: "PURCHASE NFT",
    online: true,
  },
  {
    name: "Xiximes",
    imgSrc: xixi,
    cp: "000003",
    amount: 100,
    status: "Failed",
    time: "28 Jan, 2023",
    title: "PURCHASE NFT",
    online: false,
  },
  {
    name: "Cooper",
    imgSrc: cooper,
    cp: "000003",
    amount: 30,
    status: "Pending",
    time: "01 Jan, 2023",
    title: "PURCHASE NFT",
    online: false,
  },
  {
    name: "Jane",
    imgSrc: jane,
    cp: "000003",
    amount: 15,
    status: "Successful",
    time: "31 Dec, 2022",
    title: "PURCHASE NFT",
    online: false,
  },
];
