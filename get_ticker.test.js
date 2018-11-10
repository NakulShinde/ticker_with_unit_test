const getTicker = require("./get_ticker");


function initTickerInDom(){
    var ticker_container = document.createElement("div");
    ticker_container.setAttribute("id", "test_ticker_container");
    document.body.appendChild(ticker_container);
    
    getTicker.init("test_ticker_container");
}

const inputData = {
    dataset: {
        name: "test ticker",
        column_names: [
            "Date", "Open", "High", "Low", "Close"
        ],
        data: [
            [
                "2018-03-27", 156.31, 162.85, 150.75, 152.19
            ],
            ["2018-03-26", 160.82, 161.1, 149.02, 160.06]
        ]
    }
};

const outPutData = [
    {
        key: "Name",
        value: "test ticker"
    }, {
        key: "Date",
        value: "2018-03-27"
    }, {
        key: "Open",
        value: 156.31
    }, {
        key: "High",
        value: 162.85
    }, {
        key: "Low",
        value: 150.75
    }, {
        key: "Close",
        value: 152.19
    }
];

test("validate validate() function", () => {
    expect(getTicker.validate("")).toBe(false);
    expect(getTicker.validate("text")).toBe(true);
});

test("validate parseTickerData() function", () => {

    expect(getTicker.parseTickerData(inputData)).toEqual(outPutData);
    expect(getTicker.parseTickerData([])).toEqual([]);
    expect(getTicker.parseTickerData(null)).toEqual([]);
});

test("validate DOM content after init()", () => {
    
    initTickerInDom();

    const body = document.body;
    const inputHTML = '<input id="input_field" type="text">'
    const buttonHTML = '<input id="button_field" type="button" value="Search Ticker">'
    const errorHTML = '<div style="display:none" id="error_field"></div>'
    const resultHTML = '<div style="color:gray" id="result_field"></div>'

    expect(body.innerHTML).toContain(inputHTML)
    expect(body.innerHTML).toContain(buttonHTML)
    expect(body.innerHTML).toContain(errorHTML)
    expect(body.innerHTML).toContain(resultHTML)

});

test("invalidate input error display in DOM", () => {

    const input = document.getElementById('input_field');
    const button = document.getElementById('button_field');
    const error = document.getElementById('error_field');
    input.value = '';
    button.click();
    expect(error.innerHTML).toBe("Invalid Input");
});

test("validate ticker result display in DOM", () => {

    getTicker.prepareResultDataAndDisply(outPutData)
    const result = document.getElementById('result_field');
   
    const nameHTML = '<div><label>Name</label><span>test ticker</span></div>'
    const dateHTML = '<div><label>Date</label><span>2018-03-27</span></div>'
    const openHTML = '<div><label>Open</label><span>156.31</span></div>'
    const highHTML = '<div><label>High</label><span>162.85</span></div>'
    const lowHTML = '<div><label>Low</label><span>150.75</span></div>'
    const closeHTML = '<div><label>Close</label><span>152.19</span></div>'

    expect(result.innerHTML).toContain(nameHTML);
    expect(result.innerHTML).toContain(dateHTML);
    expect(result.innerHTML).toContain(openHTML);
    expect(result.innerHTML).toContain(highHTML);
    expect(result.innerHTML).toContain(lowHTML);
    expect(result.innerHTML).toContain(closeHTML);
});