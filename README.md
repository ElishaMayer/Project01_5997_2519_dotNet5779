# Project for Course in C# and WPF 2019.
This project was written by Elisha Mayer and Yaakov Friedman.
It is part of the course in C# and WPF, at Jerusalem College of Technology, Semester A 2019.

The basic requirements are in the file <a href="https://github.com/ElishaMayer/Project01_5997_2519_dotNet5779/raw/master/%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98%20%D7%AA%D7%A9%D7%A2%D7%98.pdf">"פרוייקט תשע"ט"</a>.
The additions are in the file <a href="https://github.com/ElishaMayer/Project01_5997_2519_dotNet5779/raw/master/Documentation.docx">"Documentation"</a>.<br/>

We used <a href="https://www.nuget.org/packages/MahApps.Metro/2.0.0-alpha0083">"MahApps.Metro.2.0.0"</a> for the WPF, <a href="https://www.nuget.org/packages/pdfsharp/1.32.3057">"PDFsharp.1.32.3057.0"</a> for sending pdf by email and <a href="https://www.nuget.org/packages/Newtonsoft.Json/">"Newtonsoft.Json.12.0.1"</a> to extract the reply from google.

# Installation
To install the program without visual studio click <a href="https://github.com/ElishaMayer/Project01_5997_2519_dotNet5779/raw/master/Setup/Setup.exe">here</a>.<br/><br/>
To download the solution and run it in visual studio:<br/>
  1. Click <a href="https://github.com/ElishaMayer/Project01_5997_2519_dotNet5779/archive/master.zip">here</a> to Download the zip file of the solution.<br/>
  2. Extract the zip file.<br/>
  3. Open the "Project01_5997_2519_dotNet5779.sln" file in visual studio.<br/>
  4. In solution explorer click on Solution with the right mouse button and click on "Restore NuGet Packages".<br/>
  5. To run the WPF inetrface click with the right mouse button on the project named "PLWPF" and choose "Set as Startup Project".<br/>
  5. To run the Web Application inetrface click with the right mouse button on the project named "ReactUI" and choose "Set as Startup Project".<br/>
  6. Press Ctrl + F5 to run the program.<br/>
  
  The login username for administrator is "Admin" and the password is empty. Username and password can be changed in the settings.<br/><br/>


To use Email sending and Google Address services please enter your email address ,password and google developers key in:  "Project01_5997_2519_dotNet5779/PLWPF/bin/Debug/Data/Private.xml".<br/><br/>
**Without a Google Developer Key changing addresses and setting a tests won't work!**<br/>
To get a Google developers key click <a href="https://cloud.google.com/maps-platform/?__utma=102347093.263806779.1542194601.1550217374.1550217374.1&__utmb=102347093.0.10.1550217374&__utmc=102347093&__utmx=-&__utmz=102347093.1550217374.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)&__utmv=-&__utmk=187351080&_ga=2.199940974.1599212436.1550217359-263806779.1542194601#get-started">here</a>.<br/>
 
# Web Application
## Web API
I added a web API using ASP.NET Core. The api provides CRUD functions for Trainee, Tester and Tests. The web api is located in ReactUI project. 

## React Client
The client is written with React. There is a screen with a table to show all the Tests, Testers and Trainees. When you click on a line in the table you can see the details and update them.

## Screenshots (React UI)


To run the web Server, set the WebApi project to run at startup.
<p><b>Screenshot:<b/></p> <kbd>
<img src="Images/web.png" >
  </kbd>
 
# Screenshots (WPF)
<p><b>Login Page:<b/></p>
 <kbd>
<img src="Images/Login.png" >
  </kbd>
  <br/>
    <br/>


  <p><b>Main Page:<b/></p>
 <kbd>
<img src="Images/Main.png" >
    </kbd>
  <br/>
    <br/>
<p><b>Add Test Page:<b/></p>
   <kbd>
<img src="Images/Test.png" >
    </kbd>
  <br/>
    <br/>
<p><b>Trainee Page:<b/></p>
   <kbd>
<img src="Images/Trainee.png" >
    </kbd>
  <br/>
    <br/>
<p><b>Settings Page:<b/></p>
   <kbd>
<img src="Images/Settings.png" >
     </kbd>
