<!-- ABOUT THE PROJECT -->

# Health Care

In this project, I tried to create a simple **BLOCKCHAIN** app where

- A medical student can apply for a certificate
- Authority can verify a student who completed the course
- Anyone can check whether a doctor is verified or not

---

### Built With

- [![solidity][solidity.sol]][solidity-url]
- [![React][react.js]][react-url]
- [![Web3][web3.js]][web3-url]

---

### Frontend

- `App.js` file holds a single page application
- Smart contract functions
  - `loadWeb3` - initialize web3 and smart contracts
  - `getInitialData` - get list of certificates
  - `enrollCourse` - enroll for a course and add course fee on the blockchain
  - `finishCourse` - add unverified certificate data on the blockchain
  - `approveCertificate` - approve pending unverified certificate in the blockchain (only admin can do it)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Contracts

Contracts are located in the `src/contracts` folder

- `Certificate.sol`
- `Registry.sol`

The ABIs for the contracts are located in `src/abis` folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

---

### Prerequisites

- Clone the project

```bash
git clone https://github.com/akifpathan/healthcare
```

- Go to the project directory

```bash
cd healthcare
```

- Install `node.js`

- Install dependencies

```bash
npm install
```

- Deploy the smart contracts on Etherium or Polygon network and copy the contract address

- Create a `.env` file in project root like the following and put your admin and contract addresses (without quotes)

```env
ADMIN_ADDRESS=<here>
CERTIFICATE_CONTRACT_ADDRESS=<here>
REGISTRY_CONTRACT_ADDRESS=<here>
```

- Install `metamask`, setup account
- Set network on `metamask` to the network where you deployed you smart contracts . Might need to enable test networks in settings.

- Start the server

```bash
  npm start
```

- Visit http://locahost:3000/

- Should get prompted by `metamask` to connect to the website. Accept it and you're good to go!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- USAGE EXAMPLES -->

## Usage

Once the server is up, you can use that and play with it. All the data will be added on the blockchain.

If you want to change the courses, just edit the `App.js` file in `src` folder.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- Possible Updates -->

## Possible Updates

Here are some modifications that can be done on this project

- Update the verification page
  - add done verification list
  - add pending verification list
- Add option so that admin can add a course interactively (currently, we can add a course only by modifying the `App.js` file)
<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTACT -->

## Contact

[Ahanaf Akif Pathan](https://facebook.com/ahanafakif01) - ahanafakif01@gmail.com

Project Link: [HealthCare](https://github.com/akifpathan/healthcare)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

For developing this preject, I have taken inspiration from these resources. You can check these too!!

- [property-dapp](https://github.com/Tahmeed156/property-dapp)
- [BeeCertifier](https://github.com/hmasum52/BUET-Beecrypt-BeeCertifier)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[solidity.sol]: https://img.shields.io/badge/Solidity-FFFFFF?style=for-the-badge&logo=solidity&logoColor=363636
[solidity-url]: https://docs.soliditylang.org/en/v0.8.17/
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[web3.js]: https://img.shields.io/badge/web3.js-4A4A55?style=for-the-badge&logo=web3.js&logoColor=#F16822
[web3-url]: https://web3js.readthedocs.io/en/v1.8.1/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
