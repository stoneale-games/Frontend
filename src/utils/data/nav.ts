import nft from "../../assets/nft.png";
import wallet from "../../assets/wallet.png";
import games from "../../assets/games.png";
import book from "../../assets/book.png";

export const navs = [
  {
    imgSrc: nft,
    title: "NFTs",
    to: "/",
  },
  {
    imgSrc: wallet,
    title: "Wallet",
    to: "/wallet",
  },
  {
    imgSrc: book,
    title: "Read Rules",
    to: "/",
  },
  {
    imgSrc: games,
    title: "Games",
    to: "/",
  },
];

export const dashboardNav = [
  {
    title: "Create Game",
    action: () => {},
  },
  {
    title: "Seat & Go",
    action: () => {},
  },
  {
    title: "Weekly Game",
    action: () => {},
  },
  {
    title: "Tournament",
    action: () => {},
  },
];
