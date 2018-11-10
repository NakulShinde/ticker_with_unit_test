var get_ticker = (function () {
    'use strict';

    var API_END_POINT = "https://www.quandl.com/api/v3/datasets/WIKI/"

    var _inputField = document.createElement("input");
    var _buttonField = document.createElement("input");
    var _errorField = document.createElement("div");
    var _resultField = document.createElement("div");

    _inputField.setAttribute("id", "input_field");
    _inputField.setAttribute("type", "text");

    _buttonField.setAttribute("id", "button_field");
    _buttonField.setAttribute("type", "button");
    _buttonField.setAttribute("value", "Search Ticker");

    _errorField.setAttribute("style", "color:red");
    _errorField.setAttribute("id", "error_field");

    _resultField.setAttribute("style", "color:gray");
    _resultField.setAttribute("id", "result_field");

    function prepareResultDataAndDisply(data) {
        clearResult();
        for (var index in data) {
            var div = document.createElement("div");
            var label = document.createElement("label");
            var span = document.createElement("span");
            label.innerHTML = data[index].key;
            span.innerHTML = data[index].value;
            div.appendChild(label);
            div.appendChild(span);
            _resultField.appendChild(div);
        }
    }

    function getTickerData(ticker) {
        var URL = API_END_POINT + ticker;
        return fetch(URL)
            .then((response) => {
                if (!response.ok) {
                    throw Error("Error in getting Ticker data!");
                }
                return response;
            })
            .then(res => res.json())
    }
    function parseTickerData(data) {
        var parsedData = [];
        try {
            var columns = (data.dataset && data.dataset.column_names) ? data.dataset.column_names : [];
            var latestValue = (data.dataset && data.dataset.data) ? data.dataset.data[0] : [];
            if(data.dataset && data.dataset.data){

                parsedData.push({
                    key: "Name",
                    value: data.dataset.name
                });
            }
            for (var key in columns) {
                var obj = {
                    key: columns[key],
                    value: latestValue[key]
                };
                parsedData.push(obj);
            }
        }catch(e){}
        return parsedData;
    }

    function validate(val) {
        let isvalid = true;
        if (val.trim() === "") {
            setError("Invalid Input");
            isvalid = false;
        } else {
            clearError();
        }
        return isvalid;
    }

    function onButtonClick() {
        
        if (validate(_inputField.value)) {
            disableButton();
            setResult('Loading...');
            
            getTickerData(_inputField.value)            
            .then((data) => {
                
                enableButton();
                clearResult();
                var parsedData = parseTickerData(data);
                handleSuccess(parsedData);
                return 
            })
            .catch((error) => {
                enableButton();
                clearResult();
                handleError("Error in getting Ticker data!");
            })
        }
    }

    function handleSuccess(parsedData) {
        prepareResultDataAndDisply(parsedData);
        clearError();
    }

    function handleError(error) {
        setError(error);
    }
    function setResult(content) {
        _resultField.innerHTML = content;
    }
    function clearResult() {
        _resultField.innerHTML = '';
    }
    function setError(errorMsg) {
        _errorField.innerHTML = errorMsg;
        _errorField.setAttribute("style", "color:red;display:block");
    }
    function clearError() {
        _errorField.innerHTML = "";
        _errorField.setAttribute("style", "display:none");
    }
    function enableButton() {
        _buttonField.removeAttribute("disabled");
    }
    function disableButton() {
        _buttonField.setAttribute("disabled", true);
    }

    function init(elementId) {
        let ele = document.getElementById(elementId);

        _buttonField.onclick = onButtonClick;

        ele.appendChild(_inputField);
        ele.appendChild(_buttonField);
        ele.appendChild(_errorField);
        ele.appendChild(_resultField);
    }

    return {
        init: init,
        validate: validate,
        parseTickerData: parseTickerData,
        getTickerData: getTickerData,
        prepareResultDataAndDisply: prepareResultDataAndDisply
    };
}());

window.get_ticker = get_ticker;

if (module && module.exports) {
    module.exports = get_ticker;
}