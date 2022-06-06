import axios from 'https://cdn.skypack.dev/axios';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

class AllChatsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connection_status: false,
      is_initial: true,
      is_online: false,
      active_chat_ids: [],
      active_chats: {},
      user: null,
      loaded_chat_id: null,
      message_send: {
        is_sending: false
      },
      socketio: {
        socket: null
      }
    };
    this.custom_data = {
      typing_indicator: {
        throttle_time: 1000,
        //millie seconds
        can_publish: true
      }
    };
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "container p-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row no-gutters"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-4 border-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "settings-tray"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h6"
    }, "Connection Status-", /*#__PURE__*/React.createElement("span", {
      className: "font-weight-bold font-italic"
    }, " ", this.state.connection_status ? "Connected " : "Disconnected "), /*#__PURE__*/React.createElement("i", {
      className: this.state.connection_status ? 'fa fa-circle text-success' : 'fa fa-circle text-danger'
    }))), /*#__PURE__*/React.createElement("div", {
      className: "overflow-auto",
      style: {
        height: '540px'
      }
    }, this.renderChats())), this.state.is_initial ? this.renderWelcomeScreen() : this.renderMessages())));
  }

  componentDidMount() {
    //Update the component every one minute so the relative times will update
    this.interval = setInterval(() => this.setState({}), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    let newState = {};
    const user = await this.getUser();
    const activeChats = await this.getAllActiveChats(); // console.log(activeChats);

    if (user) {
      newState['is_online'] = user.is_online;
      newState['user'] = user;
    }

    if (activeChats) {
      //newState['active_chats'] = activeChats;
      newState['active_chats'] = {};
      activeChats.forEach(ch => {
        // console.log(ch);
        newState['active_chats'][ch._id] = ch;
      });
      newState['active_chat_ids'] = activeChats.map(ch => ch._id);
    }

    this.setState(newState);
    const socket = io('/cssa-messages', {});
    socket.on("connect", () => {
      console.log("Socket IO Connected.");
      this.setState({
        connection_status: true,
        socketio: {
          socket: socket
        }
      });
      const engine = socket.io.engine;
    }); //On Disconnect or Connection Error Event

    socket.on("connect_error", () => {
      console.log('connection Error.');
      this.setState({
        connection_status: false
      });
    }); //Register Event Listeners

    socket.on('cssa-message-send-response', arg => {
      this.listenCSSASendMessageResponse(arg);
    });
    socket.on('cssa-toggle-online-status-response', arg => {
      this.listenToggleOnlineStatus(arg);
    });
    socket.on('cssa-close-chat-response', response => {
      this.listenCloseChatResponse(response);
    });
    socket.on('cssa-chat-seen-response', response => {
      this.listenCSSAChatSeenResponse(response);
    });
    socket.on('customer-message-send', response => {
      this.listenCustomerMessageSend(response);
    });
    socket.on('customer-close-chat-response', response => {
      this.listenCloseChatResponse(response);
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
    const {
      is_online,
      user
    } = this.state;
    this.emitToggleOnlineStatus({
      is_online: !is_online,
      user_id: user._id,
      active_chat_ids: this.state.active_chat_ids
    });
  };
  loadChat = async chat_id => {
    const newState = {
      is_initial: false,
      loaded_chat_id: chat_id
    };
    let {
      active_chats
    } = this.state;
    let chat = active_chats[chat_id];

    if (!chat.is_seen_by_cssa) {
      active_chats = { ...active_chats
      };
      chat = { ...chat
      };
      chat.is_seen_by_cssa = true;
      active_chats[chat_id] = chat;
      newState['active_chats'] = active_chats; //notify Others

      this.emitCSSAChatSeen({
        chat_id
      });
    }

    this.setState(newState);
  };
  loadChatMessagesByChatID = async chat_id => {
    try {
      const response = await axios.get('/chat-messages/get/' + chat_id);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  sortChatIDsByUpdateTimestamp = (chatIds, active_chats) => {
    chatIds = [...chatIds];
    chatIds.sort((a, b) => {
      a = new Date(active_chats[a]['updated_at']);
      b = new Date(active_chats[b]['updated_at']);

      if (a > b) {
        return -1;
      }

      if (a < b) {
        return 1;
      }

      return 0;
    }); // console.log(chatIds);

    return chatIds;
  };
  inputMessage = event => {
    const {
      loaded_chat_id,
      active_chats
    } = this.state;
    const value = event.target.value;
    const newState = {
      'active_chats': { ...active_chats
      }
    };
    newState['active_chats'][loaded_chat_id]['input_value'] = value;
    this.setState(newState);
  };
  sendMessage = () => {
    const {
      loaded_chat_id,
      active_chats
    } = this.state;
    const current_chat = active_chats[loaded_chat_id];
    const message = current_chat.input_value ? current_chat.input_value : '';
    const data = {
      message,
      chat_id: loaded_chat_id
    };
    this.emitCSSASendMessage(data, this.acknowledgeCSSASendMessage);
    this.setState({
      message_send: {
        is_sending: true
      }
    });
  };
  closeChat = chat_id => {
    this.emitCloseChat({
      chat_id
    });
  };
  publishTypingIndicator = () => {
    if (this.custom_data.typing_indicator.can_publish) {
      const {
        loaded_chat_id
      } = this.state;
      this.emitCSSATypingIndicator({
        chat_id: loaded_chat_id
      });
      this.custom_data.typing_indicator.can_publish = false;
      setTimeout(() => {
        this.custom_data.typing_indicator.can_publish = true;
      }, this.custom_data.typing_indicator.throttle_time);
    }
  }; //Start - SocketIO Events and EventListeners and Acknowledgements

  emitCSSASendMessage = (message, acknowledge) => {
    const {
      socketio
    } = this.state;
    socketio.socket.emit('cssa-message-send', message, acknowledge);
  };
  listenCSSASendMessageResponse = res => {
    const {
      chatMessage,
      chat: updatedChat
    } = res;
    let newState = {};
    const {
      message_send,
      active_chats,
      active_chat_ids
    } = this.state;

    if (chatMessage) {
      if (message_send.is_sending) {
        newState = {
          message_send: {
            is_sending: false
          }
        };
      } //Add the message to the correct chat


      newState['active_chats'] = { ...active_chats
      };
      const chat = newState['active_chats'][chatMessage.chat_id];
      chat['updated_at'] = updatedChat.updated_at;
      chat['chat_messages'].push(chatMessage);
      newState['active_chat_ids'] = this.sortChatIDsByUpdateTimestamp(active_chat_ids, newState['active_chats']);
      this.setState(newState);
    }
  };
  acknowledgeCSSASendMessage = response => {
    if (response.status === 'FAILED') console.log("Send Failed.");
    const {
      chatMessage,
      chat: updatedChat
    } = response;
    let newState = {};
    const {
      message_send,
      active_chats,
      active_chat_ids
    } = this.state;

    if (chatMessage) {
      if (message_send.is_sending) {
        newState = {
          message_send: {
            is_sending: false
          }
        };
      } //Add the message to the correct chat


      newState['active_chats'] = { ...active_chats
      };
      const chat = newState['active_chats'][chatMessage.chat_id];
      chat['input_value'] = '';
      chat['updated_at'] = updatedChat.updated_at;
      chat['chat_messages'].push(chatMessage);
      newState['active_chat_ids'] = this.sortChatIDsByUpdateTimestamp(active_chat_ids, newState['active_chats']);
      this.setState(newState);
    }
  };
  emitToggleOnlineStatus = newStatus => {
    const {
      socketio
    } = this.state;
    socketio.socket.emit('cssa-toggle-online-status', newStatus);
  };
  listenToggleOnlineStatus = response => {
    this.setState({
      is_online: response.is_online
    });
  };
  emitCloseChat = content => {
    const {
      socketio
    } = this.state;
    socketio.socket.emit('cssa-close-chat', content);
  };
  listenCloseChatResponse = response => {
    if (response.status === 'OK') {
      const chat_id = response.chat_id;
      let {
        loaded_chat_id,
        active_chat_ids,
        active_chats
      } = this.state;
      active_chat_ids = active_chat_ids.filter(ch => ch !== chat_id);
      active_chats = { ...active_chats
      };
      delete active_chats[chat_id];
      let newState = {
        active_chat_ids,
        active_chats
      };
      if (loaded_chat_id === chat_id) newState['is_initial'] = true; // console.log(newState);

      this.setState(newState);
    }
  };
  emitCSSAChatSeen = content => {
    const {
      socketio
    } = this.state;
    socketio.socket.emit('cssa-chat-seen', content);
  };
  listenCSSAChatSeenResponse = response => {
    const {
      status,
      chat
    } = response;

    if (status === 'OK') {
      let {
        active_chats
      } = this.state;
      active_chats = { ...active_chats
      };
      let old_chat = active_chats[chat._id];
      let chatMessages = old_chat['chat_messages'];
      chatMessages = [...chatMessages];
      chat.input_value = old_chat.input_value;
      chat.chat_messages = chatMessages;
      active_chats[chat._id] = chat;
      this.setState({
        active_chats
      });
    }
  };
  emitCSSATypingIndicator = content => {
    const {
      socketio
    } = this.state;
    socketio.socket.emit('cssa-typing-indicator-publish', content);
  };
  listenCustomerMessageSend = response => {
    const {
      chatMessage,
      chat: updatedChat
    } = response;
    let newState = {};
    let {
      active_chats,
      active_chat_ids
    } = this.state;

    if (chatMessage) {
      //Add the message to the correct chat
      newState['active_chats'] = { ...active_chats
      };
      let chat;

      if (!newState['active_chats'][chatMessage.chat_id]) {
        chat = { ...updatedChat
        };
        chat['chat_messages'] = [];
        active_chat_ids = [...active_chat_ids];
        active_chat_ids.push(chatMessage.chat_id);
        newState['active_chats'][chatMessage.chat_id] = chat;
      } else {
        chat = newState['active_chats'][chatMessage.chat_id];
      }

      chat['updated_at'] = updatedChat.updated_at;
      chat['chat_messages'].push(chatMessage);
      newState['active_chat_ids'] = this.sortChatIDsByUpdateTimestamp(active_chat_ids, newState['active_chats']);
      this.setState(newState);
    }
  }; //End - SocketIO Events and EventListeners

  determineChatClass = chat => {
    const {
      loaded_chat_id
    } = this.state;
    let className = 'friend-drawer ';

    if (chat._id === loaded_chat_id) {
      className += 'friend-drawer--onselected';
    } else if (!chat.is_seen_by_cssa) {
      className += 'friend-drawer--onnewchats';
    } else {
      className += 'friend-drawer--onhover';
    }

    return className;
  };
  renderWelcomeScreen = () => {
    const {
      user
    } = this.state;

    if (user) {
      return /*#__PURE__*/React.createElement("div", {
        className: "col-md-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "settings-tray"
      }, /*#__PURE__*/React.createElement("div", {
        className: "friend-drawer no-gutters friend-drawer--grey"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa fa-user-circle",
        style: {
          fontSize: '40px'
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "text"
      }, /*#__PURE__*/React.createElement("h6", null, "Welcome, ", user.first_name), /*#__PURE__*/React.createElement("p", {
        className: "text-muted"
      }, user.first_name + ' ' + user.last_name + ' - ' + 'CSSA')), /*#__PURE__*/React.createElement("span", {
        className: "settings-tray--right"
      }, /*#__PURE__*/React.createElement("label", {
        className: "switch"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        onClick: () => {
          this.toggleOnlineStatus();
        },
        checked: this.state.is_online
      }), /*#__PURE__*/React.createElement("span", {
        className: "slider round1"
      })), /*#__PURE__*/React.createElement("span", {
        className: "p-2 font-weight-bold"
      }, this.state.is_online ? 'Online' : 'Offline')))));
    }
  };
  renderMessages = () => {
    const {
      loaded_chat_id,
      active_chats,
      message_send
    } = this.state;
    const loaded_chat = active_chats[loaded_chat_id];
    const loaded_chat_messages = active_chats[loaded_chat_id]['chat_messages'];
    const chatMessages = loaded_chat_messages.map((cm, index) => {
      //left
      if (cm.is_incoming) {
        return /*#__PURE__*/React.createElement("div", {
          key: cm._id,
          className: "row no-gutters"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col-md-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "chat-bubble chat-bubble--left"
        }, cm.message)));
      } else {
        //right
        return /*#__PURE__*/React.createElement("div", {
          key: cm._id,
          className: "row no-gutters"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col-md-6 offset-md-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "chat-bubble chat-bubble--right"
        }, cm.message)));
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "col-md-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "settings-tray"
    }, /*#__PURE__*/React.createElement("div", {
      className: "friend-drawer no-gutters friend-drawer--grey"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-user-circle",
      style: {
        fontSize: '40px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "text"
    }, /*#__PURE__*/React.createElement("h6", null, loaded_chat.customer_name), /*#__PURE__*/React.createElement("p", {
      className: "text-muted"
    }, "Email - ", loaded_chat.customer_email)), /*#__PURE__*/React.createElement("span", {
      className: "settings-tray--right"
    }, /*#__PURE__*/React.createElement("label", {
      className: "switch"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      onClick: () => {
        this.toggleOnlineStatus();
      },
      checked: this.state.is_online
    }), /*#__PURE__*/React.createElement("span", {
      className: "slider round1"
    })), /*#__PURE__*/React.createElement("span", {
      className: "p-2 font-weight-bold"
    }, this.state.is_online ? 'Online' : 'Offline')), /*#__PURE__*/React.createElement("i", {
      className: "material-icons ml-4 cursor font-weight-bold",
      style: {
        cursor: 'pointer'
      },
      onClick: () => this.closeChat(loaded_chat._id)
    }, "close"))), /*#__PURE__*/React.createElement("div", {
      className: "chat-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overflow-auto",
      style: {
        height: '480px'
      }
    }, chatMessages), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chat-box-tray"
    }, /*#__PURE__*/React.createElement("i", {
      className: "material-icons"
    }, "s"), /*#__PURE__*/React.createElement("input", {
      onChange: this.inputMessage,
      onKeyUp: this.publishTypingIndicator,
      type: "text",
      value: loaded_chat.input_value ? loaded_chat.input_value : '',
      placeholder: "Type your message here..."
    }), /*#__PURE__*/React.createElement("i", {
      className: "material-icons"
    }, "mic"), /*#__PURE__*/React.createElement("button", {
      onClick: this.sendMessage,
      disabled: message_send.is_sending,
      className: "round"
    }, "Send"))))));
  };
  renderChats = () => {
    const {
      active_chats,
      active_chat_ids,
      loaded_chat_id
    } = this.state;
    let view;
    view = active_chat_ids.map((chat_id, index) => {
      const chat = active_chats[chat_id];
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: chat._id
      }, /*#__PURE__*/React.createElement("div", {
        className: this.determineChatClass(chat),
        onClick: () => this.loadChat(chat._id)
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa fa-user-circle",
        style: {
          fontSize: '40px'
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "text"
      }, /*#__PURE__*/React.createElement("h6", null, chat.customer_name, " ", !chat.is_seen_by_cssa ? /*#__PURE__*/React.createElement("span", {
        className: "badge badge-success"
      }, "New") : ''), /*#__PURE__*/React.createElement("p", {
        className: "text-muted"
      }, chat.title_question)), /*#__PURE__*/React.createElement("span", {
        className: "time text-muted small"
      }, moment(chat.updated_at).fromNow())), /*#__PURE__*/React.createElement("hr", null));
    });
    return view;
  };
}

const domContainer = document.querySelector('#react-all-chats-component');
const root = ReactDOM.createRoot(domContainer);
root.render( /*#__PURE__*/React.createElement(AllChatsComponent, null));

//# sourceMappingURL=compiled-all-chats-component.js.map