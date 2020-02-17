import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class MultiseriesChart extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			timerOn: 0,
			disabled: false,
			totalTime: 10, //total time to count no of clicks
			timeInt: 1, //time interval to count no of clicks
			intCnt: 0, //time interval count
			minus: 0,
			plus: 0,
			orange: 0,
			blue: 0,
			index: 1,
			minusCnts: [],
			plusCnts: [], 
			chartData: [],
			message: "",
			intervalId: 0
		}
	}

  	//timer start
	startTimer = () => {
		if (this.state.index === 1) {
			this.setState({ intCnt: this.state.totalTime / this.state.timeInt });
			this.setState({ timerOn: 1 });
			var intId = this.interval = setInterval(() => this.process(), this.state.timeInt * 1000);
			this.setState({intervalId: intId});
		//}else if (this.state.index === this.state.intCnt){
		//	clearInterval(this.state.intervalId);
		}
	};

	process() {
		//var intCnt = this.state.totalTime / this.state.timeInt;
		console.log("tick: " +this.state.index + ", intCnt: "+this.state.intCnt+ ", Orange: "+this.state.orange + ", Blue: " + this.state.blue);

		if (this.state.index <= this.state.intCnt) {
			this.saveButtonClicks(this.state.index);
			this.setState({ index: this.state.index + 1 });
		} else {
			if (!this.state.disabled){
				this.setState({ disabled: true });
				this.setState({ message: "Time is up!" });
				//clearInterval(this.state.intId);
				this.refreshChart(this.state.minusCnts,	this.state.plusCnts);
				
				console.log("Orange: " + this.state.orange + ", Blue: " + this.state.blue);
			}
		}

		this.setState({ minus: 0 });
		this.setState({ plus: 0 });
	}
	
	componentDidMount() {
		setTimeout(clearInterval(this.state.intervalId), this.state.totalTime);
	}
	
	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}
	
	//timer end

	startProcess(){
		if (this.state.index === 1){
			this.setState({ message: "Start!" });
			this.startTimer();
		}
	}

	clickMinus = () => {
		if (!this.state.disabled) {
			this.setState({
				minus: this.state.minus + 1,
				orange: this.state.orange + 1
			});

			this.startProcess();
		}
	};

	clickPlus = () => {
		if (!this.state.disabled) {
			this.setState({
				plus: this.state.plus + 1,
				blue: this.state.blue + 1
			});

			this.startProcess();
		}
	};

	getCurDteTme = () => {
		var tempDate = new Date();
		var date =tempDate.getFullYear() +"-" + (tempDate.getMonth() + 1) +"-" + tempDate.getDate() +" " 
					+tempDate.getHours() +":" +tempDate.getMinutes() +":" +tempDate.getSeconds();
		return date;
	};

	saveButtonClicks = i => {
		var index = i*this.state.timeInt;
		this.state.minusCnts.push({y: this.state.minus, label: index});
		this.state.plusCnts.push({y: this.state.plus, label: index});
	};

	refreshChart = (minusCnts, plusCnts) => {
		var data = {
			animationEnabled: true,	
			title:{
				text: "Statistics of Button Clicks"
			},
			axisX : {
				title: "Second(s)",
				includeZero: false
			},
			axisY : {
				title: "Click(s)",
				includeZero: false
			},
			toolTip: {
				shared: true
			},
			data: [{
				type: "spline",
				name: "Orange",
				lineColor: "orange",
				markerColor: "orange",
				showInLegend: true,
				dataPoints: minusCnts
			},
			{
				type: "spline",
				name: "Blue",
				lineColor: "blue",
				markerColor: "blue",
				showInLegend: true,
				dataPoints: plusCnts
			}]
		}

		this.setState({ chartData: data });
	};

	getControlPanel() {
		return (
			<table width="500" border="0">
				<tbody>
					<tr>
						<td colSpan="2"><br /><h3>{this.state.message}</h3></td>
					</tr>
					<tr>
						<td>No of click(s): {this.state.orange}</td>
						<td>No of click(s): {this.state.blue}</td>
					</tr>
					<tr>
						<td><button onClick={this.clickMinus} className="button round orange">-</button></td>
						<td><button onClick={this.clickPlus} className="button round blue">+</button></td>
					</tr>
					<tr>
						<td colSpan="2">
							<br /><button	className="resetButton"	onClick={() => window.location.reload(false)}>Reset</button>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		return (
		<div className="content">
			<CanvasJSChart options = {this.state.chartData} 
				/* onRef={ref => this.chart = ref} */
			/>
			{this.getControlPanel()}
		</div>
		);
	}
}

export default MultiseriesChart;