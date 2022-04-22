import axios from 'https://cdn.skypack.dev/axios';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

class AllChatsComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			connection_status: false,
			is_initial: true,
			is_online: false,
			active_chats: [],
			user: null,
		};
	}

	render() {
		return (
			<React.Fragment>
				<div className="container">
					<h1>Connection Status - { this.state.connection_status ? "Connected" : "Disconnected"}</h1>
					<button onClick={this.toggleOnlineStatus}>
						{this.state.is_online ? 'Online' : 'Offline'}
					</button>
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
							{this.renderChats()}

						</div>
						{this.state.is_initial ? this.renderWelcomeScreen() : this.renderMessages()}

						{/*<div className="col-md-8">
							<div className="settings-tray">
								<div className="friend-drawer no-gutters friend-drawer--grey">
									<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
									<div className="text">
										<h6>Robo Cop</h6>
										<p className="text-muted">Layin' down the law since like before Christ...</p>
									</div>
									<span className="settings-tray--right">
                   <i class="material-icons">cached</i>
                        <i class="material-icons">message</i>
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
											 <i class="material-icons">s</i>
											<input type="text" placeholder="Type your message here..." />
											 <i class="material-icons">mic</i>
											<button className="round">send</button>
										</div>
									</div>
								</div>
							</div>
						</div>*/}
					</div>
				</div>
			</React.Fragment>
		);
	}

	async componentDidMount() {
		let newState = {};
		const user = await this.getUser();
		const activeChats = await this.getAllActiveChats();
		if(user) {
			newState['is_online'] = user.is_online;
			newState['user'] = user;
		}
		if(activeChats)
			newState['active_chats'] = activeChats;

		this.setState(newState);

		const socket = io('/cssa-messages',{});
		socket.on("connect", () => {
			console.log("Socket IO Connected.");
			this.setState( {connection_status: true} );
			const engine = socket.io.engine;
		});

	}

	getUser = async () => {
		try {
			const response = await axios.get('/users/get');
			return response.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	getAllActiveChats = async () => {
		try {
			const response = await axios.get('/chats/active-chats-cssa');
			return response.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	toggleOnlineStatus = () => {
		this.setState(
			{is_online: !this.state.is_online}
		);

	};

	loadChat = (chat_id) => {
		console.log(chat_id);

		const { active_chats } = this.state;

		const modified_chats = active_chats.map((chat, index) => {
			let c = {...chat};
			c['selected'] = chat._id === chat_id;
			return c;
		});

		this.setState({active_chats: modified_chats});
	};

	renderWelcomeScreen = () => {
		const {user} = this.state;
		if (user) {
			return (<div className="col-md-8">
				<div className="settings-tray">
					<div className="friend-drawer no-gutters friend-drawer--grey">
						<img className="profile-image"
							 src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt=""/>
						<div className="text">
							<h6>Welcome, {user.first_name}</h6>
							<p className="text-muted">{user.first_name + ' ' + user.last_name+ ' - ' + 'CSSA'}</p>
						</div>
						<span className="settings-tray--right">
						   <i className="material-icons">cached</i>
								<i className="material-icons">message</i>
												<i className="material-icons">menu</i>
						</span>
					</div>
				</div>
			</div>);
		}
	};

	renderMessages = () => {
		return (
			<div className="col-md-8">
				<div className="settings-tray">
					<div className="friend-drawer no-gutters friend-drawer--grey">
						<img className="profile-image"
							 src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt=""/>
						<div className="text">
							<h6>Robo Cop</h6>
							<p className="text-muted">Layin' down the law since like before Christ...</p>
						</div>
						<span className="settings-tray--right">
                   <i className="material-icons">cached</i>
                        <i className="material-icons">message</i>
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
								<i className="material-icons">s</i>
								<input type="text" placeholder="Type your message here..."/>
								<i className="material-icons">mic</i>
								<button className="round">send</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	renderChats = () => {
		const {active_chats} = this.state;

		let view;

		view = active_chats.map((chat,index) => {
			return (
				<React.Fragment key={chat._id}>
					<div className={chat.selected ? 'friend-drawer friend-drawer--onselected' : 'friend-drawer friend-drawer--onhover'} onClick={() => this.loadChat(chat._id)}>
						<img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
						<div className="text">
							<h6>{chat.customer_name}</h6>
							<p className="text-muted">{chat.title_question}</p>
						</div>
						<span className="time text-muted small">10:10</span>
					</div>
					<hr />
				</React.Fragment>
			);
		});

		return view;
	};
}

const domContainer = document.querySelector('#react-all-chats-component');
const root = ReactDOM.createRoot(domContainer);
root.render(<AllChatsComponent />);