import React from "react";

import { useState, useEffect, useMemo } from "react";
import './css/currencyConverter.css';
import currencies from '../../utils/seeds/commonCurrency.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FadeLoader from "react-spinners/FadeLoader";
import Select from 'react-select'
import CurrencyInput from 'react-currency-input-field';

import {
    faSyncAlt, faRepeat, faRightLeft, faCircleInfo
} from "@fortawesome/free-solid-svg-icons";

const URL = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/pair`;

function currencyConverter(props) {
    const [exchangeRate, setExchangeRate] = useState(0);
    const [exchangeRateAmount, setExchangeRateAmount] = useState(0);
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("$");
    const [selectAmount, setSelectAmount] = useState(10);
    const [exchangedSelectAmount, setExchangedSelectAmount] = useState(1);
    const [date, setDate] = useState(new Date());
    const [isLoading, setLoading] = useState(false);
    const [reslultContaierCls, setReslultContaierCls] = useState("hidden");

    
    let cuntriesOptions = [];
    Object.keys(currencies).map((currency, index) => {
        cuntriesOptions.push({
            value: currencies[currency].code,
            label: `${currencies[currency].code} - ${currencies[currency].name}`,
            name: currencies[currency].name,
            symbol: currencies[currency].symbol,
            index: index
        })
    });

    const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState(cuntriesOptions[0]);
    const [selectedCurrencyTo, setSelectedCurrencyTo] = useState(cuntriesOptions[48]);

    useEffect(() => {
        if( selectAmount ){
            handleConvert();
        }
    }, [selectedCurrencyFrom, selectedCurrencyTo]);

    const handleConvert = () => {
        setLoading(true);
        setExchangeRateAmount(0);
        setExchangeRate(0)
        setReslultContaierCls('hidden');
        
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`${URL}/${selectedCurrencyFrom.value}/${selectedCurrencyTo.value}/${selectAmount}`, { signal })
            .then((res) => res.json())
            .then((data) => {
                console.log({ data });
                if (data.result === "success") {
                    var conversionRate = data.conversion_rate
                    setExchangedSelectAmount(selectAmount);
                    setExchangeRateAmount(roundOffToX(2, data.conversion_result));
                    setExchangeRate(roundOffToX(2, conversionRate))
                    setLoading(false);
                    setReslultContaierCls('');
                }

            }).catch(err => {
                setLoading(false);
            });
        return () => {
            controller.abort();
        }


    }

    useEffect(() => {

        const inerval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(inerval);
        }
    }, []);

    const handleSelectTo = (_eTo) => {
        setSelectedCurrencyTo(_eTo)
    }

    const handleSelectFrom = (_eFrom) => {
        console.log(" _eFrom ", _eFrom);
        setSelectedCurrencySymbol(_eFrom.symbol)
        setSelectedCurrencyFrom(_eFrom)
    }

    const handleSwap = (_eFrom) => {
        setSelectedCurrencyFrom(selectedCurrencyTo);
        setSelectedCurrencyTo(selectedCurrencyFrom);
        setSelectedCurrencySymbol(selectedCurrencyTo.symbol);
    }

    function roundOffToX(x, value) {
        return (x) ? value.toFixed(x) : value;
    }

    return <>
        <div className="container-fluid">
            <div className="row headerContent">
                <div className="col-md-8 mx-auto headerTitle text-center">
                    <h2 className="text-uppercase">Currency Converter</h2>
                    <small className="">Check live foreign currency exchange rates</small>
                </div>
            </div>

            <div className="row">
                {isLoading ? <div className="d-flex mt-2 flex-column justify-content-center align-items-center" id="loader">
                    <FadeLoader className="mt-auto" size="20" color="#1746A2" /> </div> : ''
                }
                <div className={`col-md-10 col-sm-10 mx-auto currency-container ${isLoading ? 'blur-2' : ''}`}>
                    <div className="row mb-4">
                        <div className="col-md-3" >
                            <div className="div1">
                                <label className="text-uppercase lbl-title font-weight-bold mb-10">Amount</label>
                                <div className="flex">
                                    <div className="row g-0" >
                                        <div className="col-md-2 d-flex align-items-right">
                                            <strong className="lbl-title currency-symbol mt-auto">
                                                {selectedCurrencySymbol}
                                            </strong>
                                        </div>
                                        <div className="col-md-9 pl-0">
                                            <CurrencyInput
                                                className="inputAmount"
                                                id="input-example"
                                                name="input-name"
                                                onValueChange={
                                                    (value, name) => setSelectAmount(value)
                                                }
                                                value={selectAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 pl-0">
                            <label className="text-uppercase lbl-title font-weight-bold mb-10">From</label>
                            <div className="div2">
                                <div className="flex">
                                    <Select
                                        onChange={handleSelectFrom}
                                        value={selectedCurrencyFrom}
                                        options={cuntriesOptions}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1 d-flex flex-column justify-content-center align-items-center">
                            <span onClick={handleSwap} className="swap-icon mt-auto" id="swap-icon">
                                <FontAwesomeIcon
                                    icon={faRightLeft}
                                />
                            </span>
                        </div>
                        <div className="col-md-4 pl-0">
                            <label className="text-uppercase lbl-title font-weight-bold mb-10">To</label>
                            <div className="div2">
                                <div className="flex">
                                    <Select
                                        onChange={handleSelectTo}
                                        value={selectedCurrencyTo}
                                        options={cuntriesOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-10">
                            <div className={`row`}>
                                <div className="col-md-12">
                                    <div className={`result-container ${reslultContaierCls}`}>
                                        {isLoading ? '' : <><p className="mb-0">
                                            <span className="result-currency-from">{exchangedSelectAmount} {selectedCurrencyFrom.name} =</span>
                                            <span className="result-currency-to"> {exchangeRateAmount} {selectedCurrencyTo.name}</span>
                                        </p><p>
                                                <span className="exchange-rate">1 {selectedCurrencyFrom.value} = {exchangeRate} {selectedCurrencyTo.value}</span>
                                            </p></>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row mt-1">
                                        <div className="col-md-8 disclaimer-container">
                                            <div className="row">
                                                <div className="col-md-1 align-self-center">
                                                    <div className="disclaimer-icon-container">
                                                        <FontAwesomeIcon
                                                            icon={faCircleInfo}
                                                            size="2x"
                                                            className="font-awes-icon"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-11">
                                                    <div className="disclaimer-text-container">
                                                        <span>We use third party resources & the mid-market rate for our Converter. This is for informational purposes only. We don't claim this is exact exchange rate.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 text-right">
                            <button disabled = {!selectAmount} onClick={handleConvert} type="button" className="btn-convert btn btn-outline-primary text-uppercase text-right">convert</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="row">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default currencyConverter;
