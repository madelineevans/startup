# CS 260 Notes

seemed good I learned about git .add and commit and push and pull, but also how I can do it from in the vs ide so that is a bit easier and good to know.

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```

## Midterm Study Guide:
### Link Element:
The `<link>` element is used to link external resources to the HTML document, such as stylesheets. It is placed within the `<head>` section of the document.

### Div Tag
The `<div>` tag is a block-level container used to group and style sections of HTML content. It does not inherently convey any meaning about its content. 

### Title and .grid
The `<title>` element defines the title of the HTML document, which is displayed in the browser's title bar or tab. The `.grid` class is often used in CSS to create a grid layout for arranging elements in rows and columns.

### padding vs margin
Padding is the space between the content of an element and its border, while margin is the space outside the border that separates the element from other elements.

### flex
Flexbox is a CSS layout model that allows for the arrangement of elements in a flexible and responsive manner, either in rows or columns. It provides control over alignment, spacing, and distribution of items within a container.
<!-- TODO: ADD MORE HERE -->

### arrow syntax
Arrow functions provide a concise syntax for writing functions in JavaScript. They are often used for shorter function expressions and do not have their own `this` context.

### HTML span
The `<span>` tag is an inline container used to group and style text or other inline elements without affecting the layout of the document. It is often used for applying styles or scripts to a specific portion of text.
<!-- TODO: add default display property -->

### CSS Background Color
The `background-color` property in CSS is used to set the background color of an element. It can accept color names, hex values, RGB, RGBA, HSL, and HSLA values.

### DOM
The Document Object Model (DOM) is a programming interface for web documents. It represents the structure of an HTML or XML document as a tree of objects, allowing scripts to manipulate the content, structure, and style of the document dynamically.

### Image Display
The `display` property in CSS determines how an element is displayed on the page. Common values include `block`, `inline`, `inline-block`, `flex`, and `grid`. For images, the default display is `inline`, but it can be changed to `block` or other values as needed.

<!-- add code with hyperlink -->

### CSS Box Model
The CSS Box Model describes the rectangular boxes generated for elements in the document tree and consists of four areas (inner to outer): content, padding, border, and margin. Understanding the box model is essential for controlling layout and spacing in web design.

### CSS Selectors
CSS selectors are patterns used to select and style HTML elements. Common types include element selectors (e
.g., `div`), class selectors (e.g., `.className`), ID selectors (e.g., `#idName`), attribute selectors (e.g., `[type="text"]`), and pseudo-classes (e.g., `:hover`).

### CSS Positioning
CSS positioning allows you to control the layout of elements on a webpage. The main position values are

### Text formatting
- `font-family`: Specifies the font of the text.
- `font-size`: Sets the size of the text.
- `font-weight`: Defines the weight (boldness) of the text.
- `text-align`: Aligns the text within its container (e.g., left, right, center, justify).
- `line-height`: Sets the height of lines of text, affecting spacing between lines.

### Javascript
<!-- TODO: changing text color ... -->

### Opening HTML Tag for Paragraph
The opening HTML tag for a paragraph is `<p>`.

### Opening HTML Tag for ordered list
The opening HTML tag for an ordered list is `<ol>`.

### Opening HTML Tag for n level heading
The opening HTML tag for a second level heading is `<hn>`.
ex: `<h1>` `<h2>` `<h3>`

### HTML Declaration
The HTML declaration is `<!DOCTYPE html>`, which defines the document type and version of HTML being used.

### Javascript syntax for if/else
```javascript
if (condition) {} else{}
```

### Javascript syntax for function
```javascript
function functionName(parameters) {}
```

### Javascript syntax for while
```javascript
while (condition) {}
```
### Javascript syntax for for loop
```javascript
for (initialization; condition; increment) {}
```

### Javascript syntax for array
```javascript
let arrayName = [element1, element2, element3];
```

### Javascript syntax for switch 
```javascript
switch(expression) {
  case value1:
    // code to be executed if expression === value1
    break;
  case value2:
    // code to be executed if expression === value2
    break;
  default:
    // code to be executed if expression doesn't match any case
}
```
### Javascript syntax for object
```javascript
let objectName = {}
objectName['property'] = 'random';
```

### Including Javascript on an HTML page
```html
<script src="script.js"></script>
```

### Including CSS on an HTML page
```html
<link rel="stylesheet" href="styles.css">
```

### given the following HTML, What javaScript could you use to set the text "animal" to "crow" and leave the "fish" unaffected?
<!-- TODO: Check this -->
```html
<p id="animal">animal</p>
<p class="fish">fish</p>
```
```javascript
document.getElementById("animal").innerText = "crow";
```
### JSON object
a JSON object 
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

### Console Command chmod
The `chmod` command in the console is used to change the file permissions of a file or directory. It can set read, write, and execute permissions for the owner, group, and others. For example, `chmod 755 filename` sets the permissions to read, write, and execute for the owner, and read and execute

### Console Command pwd
The `pwd` command in the console stands for "print working directory." It displays the current directory path you are in within the file system.

### Console Command ls
The `ls` command in the console is used to list the files and directories in the current directory. It can be used with various options to display additional information, such as file permissions, sizes, and modification dates.

### Console Command cd
The `cd` command in the console stands for "change directory." It is used to navigate

### Console Command vim
The `vim` command in the console is used to open the Vim text editor, which is a powerful and flexible editor for creating and editing text files. You can use it to write code, edit configuration files, and more.

### Console Command nano
The `nano` command in the console is used to open the Nano text editor, which is a simple and user-friendly editor for creating and editing text files. It is often preferred for its ease of use compared to more complex editors like Vim.

### Console Command mkdir
The `mkdir` command in the console stands for "make directory." It is used to create a new directory (folder) in the file system. For example, `mkdir newFolder` creates a directory named "newFolder" in the current location.

### Console Command mv
The `mv` command in the console stands for "move." It is used to move or rename files and directories. For example, `mv oldname.txt newname.txt` renames the file, and `mv file.txt /new/location/` moves the file to a different directory.

### Console Command rm
The `rm` command in the console stands for "remove." It is used to delete files and directories. For example, `rm file.txt` deletes the specified file. To remove a directory and its contents, you can use `rm -r directoryName`.

### Console Command rm
The `rm` command in the console stands for "remove." It is used to delete files and directories. For example, `rm file.txt` deletes the specified file. To remove a directory and its contents, you can use `rm -r directoryName`.

### Console Command man
The `man` command in the console stands for "manual." It is used to display the manual pages for other commands, providing detailed information about their usage, options, and examples. For example, `man ls` shows the manual for the `ls` command.

### Console Command ssh
The `ssh` command in the console stands for "secure shell." It is used to securely connect to a remote server or computer over a network. For example, `ssh user@hostname` connects to the specified host using the provided username.

### Console Command ps
The `ps` command in the console stands for "process status." It is used to display information about the currently running processes on the system. For example, `ps aux` shows a detailed list of all processes, including their user, CPU usage, memory usage, and more.

### Console Command wget
The `wget` command in the console is used to download files from the internet. It supports various protocols, including HTTP, HTTPS, and FTP. For example, `wget http://example.com/file.zip` downloads the specified file to the current directory.

### Console Command sudo
The `sudo` command in the console stands for "superuser do." It allows a permitted user to execute a command as the superuser or another user, as specified by the security policy. It is commonly used to perform administrative tasks that require elevated privileges. For example, `sudo apt-get update` runs the update command with superuser privileges.

### Console Command -la
The `-la` option is commonly used with the `ls` command in the console. It combines two options: `-l` (long format) and `-a` (all files). When used together as `ls -la`, it lists all files and directories, including hidden ones, in a detailed format that shows permissions, ownership, size, and modification date.

### Domain Names
banana.fruit.bozo.click
top-level = click 
Root domain = bozo (bozo.click)
subdomains = banana, fruit (banana.fruit.bozo.click)

### HTTPS VS HTTP
HTTPS (HyperText Transfer Protocol Secure) is the secure version of HTTP (HyperText Transfer Protocol). The main difference is that HTTPS uses encryption (SSL/TLS) to protect data transmitted between the user's browser and the web server, ensuring confidentiality and integrity. HTTP does not provide this level of security, making it vulnerable. HTTPS requires a web certificate.

### DNS A Record
A DNS A Record can point to only an IP address

### Port 443
Port 443 is the default port for HTTPS — the protocol that encrypts web traffic using TLS/SSL.

### Port 80
Port 80 is the default port for HTTP — the standard, unencrypted web traffic protocol.

### Port 22
Port 22 is the default port for SSH (Secure Shell) — the protocol used to securely log into and manage remote systems.

### Javascript Promises
A JavaScript Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. Promises provide a way to handle asynchronous tasks in a more manageable and readable way compared to traditional callback functions.

### Javascript Async/Await
`async` and `await` are keywords in JavaScript that simplify working with Promises.