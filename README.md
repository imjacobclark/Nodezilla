Nodezilla
=========

This is a side project where I hope to build a fully featured response and load testing application for modern websites where scalability and performance matters.

###### Current features:

* Continous response testing (linear) with average load time calculation.
* (Partial, needs improving) REST API to create tests programatically.

###### Coming soon:

* Batched response testing (x requests every n seconds)
* Incremented response testing (x*y requests every second)
* Load testing through Phantom (page load times including images, stylesheets and JavaScript)
* Real time graphs for page load times

Install the latest _pre-released_ build for your testing pleasure:

### Installation:

```bash
$ wget https://github.com/imjacobclark/Nodezilla/archive/v0.0.2.tar.gz && tar -zxvf v0.0.2.tar.gz && cd Nodezilla-0.0.2
$ npm install
$ node server.js
```
