/**
 *
 *  Data Format: https://ecomfe.github.io/echarts-doc/public/en/option.html#series-bar.data
 *  DimX = Date/Time (value can be a timestamp (1484141700832) (UTC Time) or a date string like '2012-03' or a js date instance)
 *  DimY = value
 *
 * eCharts gallery: https://ecomfe.github.io/echarts-examples/public/index.html
 *
 */

function generateData(count) {
  var baseValue = Math.random() * 1000;
  var time = +new Date(2018, 0, 1);
  var smallBaseValue;

  function next(idx) {
    smallBaseValue = idx % 30 === 0
      ? Math.random() * 700
      : (smallBaseValue + Math.random() * 500 - 250);
    baseValue += Math.random() * 20 - 10;
    return Math.max(
      0,
      Math.round(baseValue + smallBaseValue) + 3000
    );
  }

  var categoryData = [];
  var valueData = [];

  for (var i = 0; i < count; i++) {
    categoryData.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', time));
    valueData.push(next(i).toFixed(2));
    time += 1000;
  }

  return {
    categoryData: categoryData,
    valueData: valueData
  };
}

function loadCharts(taskId) {

  $("#charts").empty();
  // Test data
  // var dataCount = 5e2;
  // var data = generateData(dataCount);

  getRequestData(taskId).then((data) => {
    loadChart("Users Logged In (Daily)", "Number of users who logged in daily", data, "users-loggedIn-daily", "bar");
    loadChart("Users Going On Queue (Daily)", "Number of users going on queue daily", data, "users-onqueue-daily", "bar");
    loadChart("IVR Data Dips (Daily)", "Number of IVR data dips daily", data, "webservices-datadip", "bar");
    loadChart("Secure IVR (Daily)", "Number of calls using the Secure IVR for payment purposes", data, "secure-ivr", "bar");
    loadChart("PureCloud Data Actions (Daily)", "Number of PureCloud data actions being used daily", data, "purecloud-data-actions", "bar");
    loadChart("AWS Lambda Data Actions (Daily)", "Number of AWS Lambda data actions being used daily", data, "aws-lambda-data-actions", "bar");
    loadChart("Dialer Outbound Calls (Daily)", "Number of processed dialer outbound calls daily", data, "interactions-dialer", "bar");
    loadChart("Voice Interactions (Daily)", "Number of inbound and outbound processed calls daily", data, "interactions-call", "bar");
    loadChart("Callbacks (Daily)", "Number of callback interactions daily", data, "interactions-callback", "bar");
    loadChart("Emails (Daily)", "Number of email interactions daily", data, "interactions-email", "bar");
    loadChart("Web Chats (Daily)", "Number of web chat interactions daily", data, "interactions-chat", "bar");
    loadChart("Co-Browse (Daily)", "Number of co-browse interactions daily", data, "interactions-cobrowse", "bar");
    loadChart("Screen Shares (Daily)", "Number of screen share session daily", data, "interactions-screenShare", "bar");
    loadChart("SMS (Daily)", "Number of processed SMS interactions daily", data, "interactions-sms", "bar");
    loadChart("Messaging (Daily)", "Number of messaging interactions daily", data, "interactions-message", "bar");
    loadChart("API Calls (Daily)", "Number of daily API calls", data, "api-calls", "bar");
    loadChart("Salesforce CRM Web Client Connections (Daily)", "Number of connections to the Salesforce CRM Web Client", data, "crm-web-client-salesforce", "bar");
  }).catch((err) => {
    console.error(err);
    if (err.length == 0) {
      showMessage("No data found for this task. Please wait for a few mins and click on Refresh", true);
    }
  });

}

/**
 *
 * @param {*} title Chart Title
 * @param {*} subtitle Chart Subtitle
 * @param {*} data Data retrieved from AWS
 * @param {*} category Category of the data needed for the chart
 * @param {*} chartType bar, etc.
 */
function loadChart(title, subtitle, data, category, chartType) {

  console.debug(`Checking if data with category ${category}`);
  var matchEntries = data.filter(i => i.category == category);
  if (matchEntries.length == 0) {
    return;
  }

  //console.debug(`data has ${category} entries: ${JSON.stringify(matchEntries)}`);
  $.each(matchEntries, (i, entry) => {
    console.log(i + ":" + JSON.stringify(entry));

    // Build data object
    var categoryData = [];
    var valueData = [];

    $.each(entry.data, (j, dataEntry) => {
      categoryData.push(echarts.format.formatTime("yyyy-MM-dd", dataEntry.date));
      valueData.push(dataEntry.value);
    })

    console.log(categoryData);
    console.log(valueData);

    // Draw chart

    var col = document.createElement("div");
    col.className = "col-4";

    var divName = title.replace(/\W/g, ""); // Remove non-alphanumeric characters from the string to build the div name
    var divChart = document.createElement("div");
    divChart.setAttribute("id", divName);
    divChart.className = "shadow-lg mt-3";

    col.append(divChart);
    $("#charts").append(col);

    $(`#${divName}`).css("width", "100%");
    $(`#${divName}`).css("min-height", "300px");

    // Initialize echarts instance
    var myChart = echarts.init(document.getElementById(divName));

    var option = {
      title: {
        text: title,
        subtext: subtitle,
        left: 5,
        top: 5
      },
      toolbox: {
        showTitle: true,
        feature: {
          saveAsImage: {
            type: "jpeg",
            pixelRatio: 2
          },
          dataZoom: {
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        bottom: 90
      },
      dataZoom: [{
        type: 'inside'
      }, {
        type: 'slider'
      }],
      xAxis: {
        data: categoryData,
        silent: false,
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      },
      yAxis: {
        splitArea: {
          show: false
        }
      },
      series: [{
        type: chartType,
        data: valueData,
        // Set `large` for large data amount
        large: true
      }]
    };

    // Show chart
    myChart.setOption(option);
  });
}