# Lighthouse

Lighthouse is an open-source, automated tool for improving the performance, quality, and correctness of your web apps. 

When auditing a page, Lighthouse runs a barrage of tests against the page, and then generates a report on how well the page did. From here you can use the failing tests as indicators on what you can do to improve your app.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Overview](#overview)


## Introduction

This repository consists of a custom Next.js tool designed to conduct website performance audits using Lighthouse. The tool enables users to input website URLs and generates comprehensive performance reports based on Lighthouse metrics.

## Getting Started

### Prerequisites

- docker

### Installation

1. Clone the repository  :

   ```bash
   git clone https://github.com/ishakzail/void-audit-tool
   ```
2. Add reports Folder

    ```bash
    cd void-audit-tool && mkdir reports
    ```
    
3. Navigate to the root directory, then build the image: 

    ```bash
    docker build -t image_nam
    ```

4. Run the container:  
    ```bash
    docker run -p port:port container_name 
    ```
## Usage

1. Navigate to the browser and type: 

    ```bash
    localhost:port
    ```

## Overview
* **https://www.loom.com/share/de35f1debbdc42dda607f71b7f483049**