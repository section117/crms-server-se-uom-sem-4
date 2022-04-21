import axios from 'https://cdn.skypack.dev/axios';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

class AllChatsComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			connection_status: false
		};
	}

	render() {
		return (
			<React.Fragment>
				<div className="container">
					<h1>Connection Status - { this.state.connection_status ? "Connected" : "Disconnected"}</h1>
					<div className="row no-gutters">
						<div className="col-md-4 border-right">
							<div className="settings-tray">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg" alt="Profile img" />
								<span className="settings-tray--right">
                {/* <i class="material-icons">cached</i>
                    <i class="material-icons">message</i> */}
									<i className="material-icons">menu</i>
              </span>
							</div>
							<div className="search-box">
								<div className="input-wrapper">
									<i className="material-icons">search</i>
									<input placeholder="Search here" type="text" />
								</div>
							</div>
							<div className="friend-drawer friend-drawer--onhover">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
								<div className="text">
									<h6>Robo Cop</h6>
									<p className="text-muted">Hey, you're arrested!</p>
								</div>
								<span className="time text-muted small">13:21</span>
							</div>
							<hr />
							<div className="friend-drawer friend-drawer--onhover">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/optimus-prime.jpeg" alt="" />
								<div className="text">
									<h6>Optimus</h6>
									<p className="text-muted">Wanna grab a beer?</p>
								</div>
								<span className="time text-muted small">00:32</span>
							</div>
							<hr />
							<div className="friend-drawer friend-drawer--onhover ">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/real-terminator.png" alt="" />
								<div className="text">
									<h6>Skynet</h6>
									<p className="text-muted">Seen that canned piece of s?</p>
								</div>
								<span className="time text-muted small">13:21</span>
							</div>
							<hr />
							<div className="friend-drawer friend-drawer--onhover">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/termy.jpg" alt="" />
								<div className="text">
									<h6>Termy</h6>
									<p className="text-muted">Im studying spanish...</p>
								</div>
								<span className="time text-muted small">13:21</span>
							</div>
							<hr />
							<div className="friend-drawer friend-drawer--onhover">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/rick.jpg" alt="" />
								<div className="text">
									<h6>Richard</h6>
									<p className="text-muted">I'm not sure...</p>
								</div>
								<span className="time text-muted small">13:21</span>
							</div>
							<hr />
							<div className="friend-drawer friend-drawer--onhover">
								<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/rachel.jpeg" alt="" />
								<div className="text">
									<h6>XXXXX</h6>
									<p className="text-muted">Hi, wanna see something?</p>
								</div>
								<span className="time text-muted small">13:21</span>
							</div>
						</div>
						<div className="col-md-8">
							<div className="settings-tray">
								<div className="friend-drawer no-gutters friend-drawer--grey">
									<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
									<div className="text">
										<h6>Robo Cop</h6>
										<p className="text-muted">Layin' down the law since like before Christ...</p>
									</div>
									<span className="settings-tray--right">
                  {/* <i class="material-icons">cached</i>
                        <i class="material-icons">message</i> */}
										<i className="material-icons">menu</i>
                </span>
								</div>
							</div>
							<div className="chat-panel">
								<div className="row no-gutters">
									<div className="col-md-3">
										<div className="chat-bubble chat-bubble--left">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3 offset-md-9">
										<div className="chat-bubble chat-bubble--right">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3 offset-md-9">
										<div className="chat-bubble chat-bubble--right">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3">
										<div className="chat-bubble chat-bubble--left">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3">
										<div className="chat-bubble chat-bubble--left">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3">
										<div className="chat-bubble chat-bubble--left">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row no-gutters">
									<div className="col-md-3 offset-md-9">
										<div className="chat-bubble chat-bubble--right">
											Hello dude!
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="chat-box-tray">
											{/* <i class="material-icons">s</i> */}
											<input type="text" placeholder="Type your message here..." />
											{/* <i class="material-icons">mic</i> */}
											<button className="round">send</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		const socket = io('/cssa-messages',{});
		socket.on("connect", () => {
			console.log("Socket IO Connected.");
			this.setState( {connection_status: true} );
			const engine = socket.io.engine;
		});
	}
}

const domContainer = document.querySelector('#react-all-chats-component');
const root = ReactDOM.createRoot(domContainer);
root.render(<AllChatsComponent />);