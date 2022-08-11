# Customer Relationship Management System
Customer live chat Management System with NodeJS, Express,React, EJS and SocketIO for the Semester 4 Software Engineering Project.


# Installation Guide
<ul>
<li>
Clone the project.
</li>
<li>
Copy <code>.env.example</code> file and name it as <code>.env</code>.
</li>
<li>
Set up necessary varaibles like <code>PORT</code>, <code>NODE_ENV</code>.
</li>
<li>
Run <code>npm install</code> command in the terminal.
</li>
<li>
Use <code>start</code> (node) or <code>start-dec</code> (nodemon) script to start the server. 
</li>
</ul>

# How to compile the React Chat Component?
The React Chat Component has been built using Babel. Therefore, in a production environment Babel needs to be compiled. 
`babel/cli`, `babel/core` and `babel/preset-react`  is used for this purpose.
<ul>
<li>Navigate to the <code>public\assets\js\custom\react</code> directory.</li>
<li>Run the command <code>npx babel --presets @babel/preset-react all-chats-component.js --out-file compiled-all-chats-component.js --source-maps</code>
 in the terminal.</li>
<li>This will compile the React JSX component to the file <code>compiled-all-chats-component.js</code> with source maps.</li>
</ul>
