import React, { useEffect, useState } from "react";
import { THCTokenContract, THCStakingContract } from "../config";
import {
  errHandler,
  tips,
  /* toValue, */ fromValue,
  fromBigNum,
  timeFix,
} from "../util";
import { BigNumber, ethers } from "ethers";
import { Link, Outlet } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useWebContext } from "../context";
import web3 from "web3";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { AiOutlineFieldTime } from "react-icons/ai";
import "./index.scss";

// interface StakingStatus {
//   lockPeriod: number;
//   apy: number;
//   extendsLockOnRegistration: boolean;
//   stakeDate: number;
//   locked: boolean;
//   reward: number;
//   balance: number;
//   stakedAmount: number;
//   THCTotalAmountToWallet: number;
//   claimStatus: boolean;
// }

const Dashboard = () => {
  const [state, { dispatch }] = useWebContext();
  const [signedTokenContracts, setSignedTokenContracts] =
    useState(THCTokenContract);
  const [signedStakingContracts, setSignedStakingContracts] =
    useState(THCStakingContract);
  const [unStakeValue, setUnStakeValue] = useState(0);
  const [ready, setReady] = useState(false);
  const { connect, account, active, library, chainId } = useWallet();

  // const [statusApp, setStatusApp] = useState<StakingStatus>({
  //   lockPeriod: 0,
  //   apy: 0,
  //   extendsLockOnRegistration: true,
  //   stakeDate: 36,
  //   locked: false,
  //   reward: 0,
  //   balance: 0,
  //   stakedAmount: 0,
  //   THCTotalAmountToWallet: 0,
  //   claimStatus: false,
  // });

  const [lockPeriod, setLockPeriod] = useState<number>(0);
  const [apy, setApy] = useState<number>(0);
  const [extendsLockOnRegistration, setExtendsLockOnRegistration] =
    useState<boolean>(true);
  const [stakeDate, setStakeDate] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(false);
  const [reward, setReward] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [THCTotalAmountToWallet, setTHCTotalAmountToWallet] =
    useState<number>(0);
  const [claimStatus, setClaimStatus] = useState<boolean>(false);
  const [nowTime, setNowTime] = useState<number>(0);
  const [everyDayReward, setEveryDayReward] = useState<number>(0);

  const [countDays, setCountDays] = useState(0);
  const [countHours, setCountHours] = useState(0);
  const [countMinutes, setCountMinutes] = useState(0);
  const [countSeconds, setCountSeconds] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [chartData, setChartData] = useState([
    {
      date: "1 day",
      reward: "0",
    },
    {
      date: "2 day",
      reward: "1398",
    },
    {
      date: "3 day",
      reward: "9800",
    },
    {
      date: "4 day",
      reward: "3908",
    },
    {
      date: "5 day",
      reward: "4800",
    },
    {
      date: "6 day",
      reward: "3800",
    },
    {
      date: "7 day",
      reward: "4300",
    },
  ]);

  const contractAndChainId = async () => {
    const setSignedContracts = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(library.provider);
        const signer = await provider.getSigner();
        var signedTokenContracts = THCTokenContract.connect(signer);
        var signedStakingContracts = THCStakingContract.connect(signer);

        setSignedTokenContracts(signedTokenContracts);
        setSignedStakingContracts(signedStakingContracts);
        setReady(true);
      } catch (err) {
        errHandler(err);
      }
    };
    if (active) {
      setSignedContracts();
    }
    console.log("chainID :::::");
    console.log(chainId);
    if (chainId !== 56) {
      let res = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x56" }],
      });
    }
  };

  useEffect(() => {
    contractAndChainId();
  }, [account, chainId]);

  useEffect(() => {
    setIsMobile(false);
    if (window.innerWidth < 600) {
      setIsMobile(true);
    }
  }, [window.innerWidth]);

  const getBalance = async () => {
    try {
      if (active) {
        var provider = new ethers.providers.Web3Provider(library.provider);
        const signer = provider.getSigner();
        var MyContract = THCTokenContract.connect(signer);
        let tokenDecimals = (await MyContract.decimals()).toString();
        let balance = await MyContract.balanceOf(account);
        let bigBal = fromBigNum(balance, tokenDecimals);
        console.log(bigBal);
        // setStatusApp({ ...statusApp, stakeValue: statusApp.balance })
        let THCBalanceOfWallet = Number(bigBal.toFixed(3));
        setTHCTotalAmountToWallet(THCBalanceOfWallet);
      } else if (!active) {
        return tips("Please Connect Metamask Wallet");
      }
    } catch (err) {
      console.log("context : getBalance error", err);
      // toast.error("context : getBalance error", err);
    }
  };

  const getStakingInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(library.provider);
      const signer = provider.getSigner();
      var signedTokenContracts = THCTokenContract.connect(signer);
      var signedStakingContracts = THCStakingContract.connect(signer);

      var stakeDate = await signedStakingContracts.stakers(account);
      var nowTime = await signedStakingContracts.nowUnixTime();
      let tokenDecimals = (await signedTokenContracts.decimals()).toString();
      let rewards = fromBigNum(stakeDate.rewards, Number(tokenDecimals));
      // console.log("stakeDate : ");
      // console.log(stakeDate);
      setNowTime(Number(nowTime));
      setReward(rewards);
      setLockPeriod(Number(stakeDate.period));
      setStakeDate(Number(stakeDate.stakingDate));
      setStakedAmount(fromBigNum(stakeDate.stakes, Number(tokenDecimals)));

      // console.log("nowTime : ", Number(nowTime));
      // console.log("stakeDate.stakingDate :", Number(stakeDate.stakingDate));
      // console.log(
      //   "stakeDate.stakes :",
      //   fromBigNum(stakeDate.stakes, Number(tokenDecimals))
      // );
      // console.log(" stakedate.period : ", Number(stakeDate.period));
      let staked = fromBigNum(stakeDate.stakes, tokenDecimals);

      if (staked > 0) {
        setUnStakeValue(staked);
      }
      // stakeDate.stakingDate -> unix time (1970.1.1 second)
      // stakeDate.period -> staking date (7 , 30 , 90)
      if (
        Number(nowTime) - Number(stakeDate.stakingDate) <
        Number(stakeDate.period) * 3600 * 24
      ) {
        setClaimStatus(false);
        // not claim
      } else {
        // you can receive claim
        setClaimStatus(true);
      }
      if (Number(stakeDate.period) === 7) setApy(1.2);
      if (Number(stakeDate.period) === 7) setApy(9.8);
      if (Number(stakeDate.period) === 7) setApy(35.6);

      if (Number(stakeDate.stakingDate) !== 0) {
        setLocked(true);
      } else {
        setLocked(false);
      }

      // chart data
      let chartData: any = [];
      let reward_ = rewards / Number(stakeDate.period);
      setEveryDayReward(reward_);
      for (let i = 1; i <= Number(stakeDate.period); i++) {
        let reward = reward_ * i;
        chartData.push({
          date: i + "day",
          reward,
        });
      }

      setChartData(chartData);
      getTime(Number(stakeDate.stakingDate), Number(stakeDate.period));
    } catch (error) {
      console.log("getStakingInfo : ");
      console.log(error);
    }
  };

  const getTime = async (stakeDate: number, lockPeriod: number) => {
    if (stakeDate && lockPeriod) {
      let nowTime = Math.floor(+new Date() / 1000);
      let rewardTime = stakeDate + lockPeriod * 24 * 3600;
      let remainTime = rewardTime - nowTime;
      // let unix_timestamp = 1549312452;
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let days = Math.floor(remainTime / (24 * 3600));
      remainTime = remainTime % (24 * 3600);
      let hours = Math.floor(remainTime / 3600);
      remainTime = remainTime % 3600;

      let minutes = Math.floor(remainTime / 60);
      remainTime = remainTime % 60;
      // let seconds = Math.round(remainTime / 3600);
      console.log(hours, minutes, remainTime);
      setCountDays(days);
      setCountHours(hours);
      setCountMinutes(minutes);
      setCountSeconds(remainTime);
    }
  };

  const [timer, setTimer] = useState(+new Date());
  useEffect(() => {
    getTime(stakeDate, lockPeriod);
    const clearTimer = setTimeout(() => {
      setTimer(+new Date());
    }, 1000);
    return () => clearTimeout(clearTimer);
  }, [timer]);

  useEffect(() => {
    if (!state.disconnect_able) {
      setLocked(false);
    } else {
      getStakingInfo();
    }
  }, [state.disconnect_able]);

  useEffect(() => {
    getStakingInfo();
    getBalance();
  }, [account]);

  return (
    <section className="dashboard py-7 py-md-0 bg-hero">
      <div className="container ">
        <div className="row">
          <div className="col-12 text-center w10">
            <h2
              className="heading-black text-capitalize"
              style={{ color: "#1de9b6" }}
            >
              User Dashboard
            </h2>
            <h3 className="dashboard-title white-color">
              <Link to="/" style={{ color: "white" }}>
                Staking Page
              </Link>
            </h3>
            <div className="">
              <h4
                className="heading-black text-capitalize"
                style={{ color: "#1de9b6" }}
              >
                Balance :{" "}
                {state.disconnect_able && THCTotalAmountToWallet
                  ? THCTotalAmountToWallet
                  : 0}
              </h4>
            </div>

            <div className="row gap">
              <div className="mt-3 col-sm-12 col-md-6 col-lg-3">
                <button
                  style={{ width: "200px" }}
                  className="btn btn-primary d-inline-flex flex-row align-items-center info-btn"
                >
                  Staker :{" "}
                  {state.disconnect_able && account
                    ? account.slice(0, 4) +
                      "..." +
                      account.slice(account.length - 4, account.length)
                    : 0}
                </button>
              </div>
              <div className="mt-3 col-sm-12 col-md-6 col-lg-3">
                <button
                  style={{ width: "200px" }}
                  className="btn btn-primary d-inline-flex flex-row align-items-center info-btn"
                >
                  Reward : {state.disconnect_able ? reward : 0} +{" "}
                  {state.disconnect_able ? stakedAmount : 0}
                </button>
              </div>
              <div className="mt-3 col-sm-12 col-md-6 col-lg-3">
                <button
                  style={{ width: "200px" }}
                  className="btn btn-primary d-inline-flex flex-row align-items-center info-btn"
                >
                  Period : {state.disconnect_able ? lockPeriod : 0}
                </button>
              </div>
              <div className="mt-3 col-sm-12 col-md-6 col-lg-3">
                <button
                  style={{ width: "200px" }}
                  className="btn btn-primary d-inline-flex flex-row align-items-center info-btn"
                >
                  Staked Amount : {state.disconnect_able ? stakedAmount : 0}
                </button>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12">
                <div className="">
                  <button
                    style={{ width: "300px" }}
                    className="btn btn-primary d-inline-flex flex-row align-items-center time-count"
                  >
                    <AiOutlineFieldTime style={{ fontSize: "40px" }} />
                    {state.disconnect_able ? (
                      <>
                        {" "}
                        {countDays} days : {timeFix(countHours)} :{" "}
                        {timeFix(countMinutes)} : {timeFix(countSeconds)}
                      </>
                    ) : (
                      <> 00 : 00 : 00 : 00</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <p className="lead py-3">
              <span className="">Staking Amount </span>: Mininum 30,000 THC ||
              Maximum 15,000,000 THC
              <br />
            </p>
            <br />
            <br />
            <div className="chart-container justify mb-2">
              <h5 className="primary-color">
                everyday reward :{" "}
                {state.disconnect_able ? everyDayReward.toFixed(5) : 0}
              </h5>
              {state.disconnect_able ? (
                <LineChart
                  width={window.innerWidth}
                  height={400}
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 50,
                    left: isMobile ? 0 : chartData.length > 0 ? 30 : 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="2 2" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    cursorStyle={"pointer"}
                    labelStyle={{ color: "black", fontSize: "20px" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="reward"
                    stroke="#8884d8"
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              ) : (
                <></>
              )}
              {locked ? (
                <></>
              ) : (
                <div className="no-chart">
                  <h1 className="">No chart</h1>
                </div>
              )}
            </div>
            <a href="https://bscscan.com/address/0x144960C94c846D30C3b4f373C348ed5f13C1f42a">
              View official THC Staking Contract
            </a>
            <br />
            <p id="userNetwork" className="text-lg text-gray-600 my-2"></p>
          </div>
        </div>
      </div>
      <br />
      <br />
    </section>
  );
};

export default Dashboard;
