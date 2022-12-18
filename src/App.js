import { experimentalStyled as styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Web3 from "web3";
import { useState } from "react";
import registerAbi from "./abis/Registry.json";
import certifyAbi from "./abis/Certificate.json";
import env from "react-dotenv";
import { Card, CardContent, CardMedia, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

let certificateSol, registerSol;

function App() {
  const [courses, setCourses] = useState([
    {
      title: "Management for Engineers",
      description: "Manage an industry",
      fee: 10,
      issuer: env.ADMIN_ADDRESS,
      issuer_name: "Dr. Helal",
    },
    {
      title: "ComputerVision-101",
      description: "Learn Computer Vision",
      fee: 11,
      issuer: env.ADMIN_ADDRESS,
      issuer_name: "Dr. Mehedi",
    },
    {
      title: "Blockchain-101",
      description: "Learn Blockchain Basics",
      fee: 5,
      issuer: env.ADMIN_ADDRESS,
      issuer_name: "Pathan",
    },
    {
      title: "AI-101",
      description: "Learn AI",
      fee: 7,
      issuer: env.ADMIN_ADDRESS,
      issuer_name: "RMEDU",
    },
  ]);

  const [myCourses, setMyCourses] = useState([]);
  const [myCertificate, setMyCertificate] = useState(null);
  const [myCertificates, setMyCertificates] = useState([myCertificate]);

  const [unapproved, setUnapproved] = useState([]);

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const [verCertId, setVerCertId] = useState("");
  const [verOwnerName, setVerOwnerName] = useState("");
  const [verIssuerName, setVerIssuerName] = useState("");
  const [verVerified, setVerVerified] = useState("");

  const [page, setPage] = useState("courses");

  const loadWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Connect to metamask
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }

      const accounts = await web3.eth.getAccounts();

      if (typeof accounts[0] !== "undefined") {
        const balance = await web3.eth.getBalance(accounts[0]);
        setAccount(accounts[0]);
        setBalance(balance);
        if (accounts[0] === env.ADMIN_ADDRESS) {
          // Coursera
          setPage("approve");
        }
      } else {
        toast.error("Please login with metamask");
        console.log("Please login with metamask");
      }

      try {
        // Access smart contracts
        //console.log(env.CERTIFICATE_CONTRACT_ADDRESS)
        //console.log(env.REGISTRY_CONTRACT_ADDRESS);
        certificateSol = new web3.eth.Contract(
          certifyAbi,
          env.CERTIFICATE_CONTRACT_ADDRESS
        );
        registerSol = new web3.eth.Contract(
          registerAbi,
          env.REGISTRY_CONTRACT_ADDRESS
        );

        getInitialData();
      } catch (e) {
        toast.error("Error loading smart contract: " + e.message);
        console.log("Error loading smart contract: " + e);
      }
    } else {
      window.alert("Please install metamask");
    }
  };

  const getInitialData = async () => {
    // Get list of properties & purchases
    try {
      let wMyCertificates = await registerSol.methods.getCertificates().call();
      setMyCertificates(wMyCertificates.filter((c) => c.owner === account));
      setUnapproved(
        wMyCertificates.filter((c) => !c.verified && c.ownerName !== "")
      );
      const titles = myCertificates.map((c) => c && c.courseTitle);
      setCourses(courses.filter((c) => !titles.includes(c.title)));
      // console.log(wMyCertificates);
    } catch (e) {
      toast.error(e.message);
      console.log(e.message);
    }
  };

  const buyCourse = async (course) => {
    const loadId = toast.loading("Paying Fee and Enrolling for the Course...");
    console.log(course.fee);
    console.log(course.issuer);
    await registerSol.methods
      .addFee(course.title, course.issuer)
      .send({ from: account, value: course.fee, gas: 1e6 })
      .then((d) => {
        toast.dismiss(loadId);
        toast.success("Fee payment successful");
        setCourses(
          courses.filter(
            (item) =>
              item.title !== course.title || item.issuer !== course.issuer
          )
        );
        setMyCourses([...myCourses, course]);
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error paying fee");
        console.log(e);
      });
  };

  const finishCourse = async (course) => {
    const loadId = toast.loading("Applying for the certificate...");
    var name = null;
    while (name == null) {
      name = prompt("Enter your name", "Enter name");
    }
    await registerSol.methods
      .addCertifcate(course.issuer, course.title, name, course.issuer_name)
      .send({ from: account, gas: 1e6 })
      .then(() => {
        toast.dismiss(loadId);
        toast.success("Applied for certificate");
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error applying for certificate");
      });
    setMyCourses(
      myCourses.filter(
        (c) => c.title !== course.title || c.issuer !== course.issuer
      )
    );
    setMyCertificates(
      myCertificates.filter(
        (c) => c.issuer !== course.issuer || c.title !== course.title
      )
    );
  };

  const approveCertificate = async (cert) => {
    const loadId = toast.loading("Approving Certificate...");
    await registerSol.methods
      .verify(cert.id)
      .send({ from: account, gas: 1e6 })
      .then(() => {
        toast.dismiss(loadId);
        toast.success("Certificate Approved");
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error approving certificate");
        throw new Error("Error approving certificate");
      });

    let feeAmount = 0;

    for (let i = 0; i < courses.length; i++)
      if (
        courses[i].title === cert.courseTitle &&
        courses[i].issuer === cert.issuer
      ) {
        feeAmount = courses[i].fee;
      }
  };

  loadWeb3();

  let content = null;

  if (page === "courses") {
    content = (
      <>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
          Available Courses
        </Typography>
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={6}>
                <Item>
                  <Typography variant="h5">{course.title}</Typography>
                  <Typography variant="body1">{course.description}</Typography>
                  <Typography variant="body1">
                    fee: {course.fee || "None"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Course By: {course.issuer_name}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => buyCourse(course)}
                  >
                    Enroll
                  </Button>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
          My Courses
        </Typography>

        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {myCourses.map((course, index) => (
              <Grid item xs={6}>
                <Item>
                  <Typography variant="h5">{course.title}</Typography>
                  <Typography variant="body1">{course.description}</Typography>
                  <Typography variant="body1">
                    fee: {course.fee || "None"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Course By: {course.issuer_name}
                  </Typography>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => finishCourse(course)}
                    sx={{ my: 2 }}
                  >
                    Finish
                  </Button>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Container>
      </>
    );
  } else if (page === "certificates") {
    content = (
      <>
        {myCertificate && (
          <Container maxWidth="md" sx={{ mb: 4 }}>
            <Card sx={{ maxWidth: "lg" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://149396518.v2.pressablecdn.com/wp-content/uploads/2018/08/coursera-social-logo.png"
                alt="green iguana"
              />
              <CardContent sx={{ p: 4 }}>
                <Typography
                  gutterBottom
                  variant="h3"
                  component="div"
                  style={{ textAlign: "right" }}
                  color="text.secondary"
                >
                  {myCertificate.issuerName}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h2"
                  component="div"
                  sx={{ ml: 2 }}
                >
                  {myCertificate.ownerName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  has successfully completed
                </Typography>
                <Typography
                  gutterBottom
                  variant="h2"
                  component="div"
                  sx={{ ml: 2 }}
                >
                  {myCertificate.courseTitle}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  The course was authorized by National Health Institute and
                  offered by {myCertificate.issuerName}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color={myCertificate.verified ? "success" : "warning"}
                  style={{ textAlign: "right" }}
                >
                  {!myCertificate.verified
                    ? "Not Verified Yet"
                    : `Certificate ID: ${myCertificate.id}`}
                </Typography>
              </CardContent>
            </Card>
          </Container>
        )}

        <Typography variant="h4" gutterBottom component="div" sx={{ my: 4 }}>
          My Certificates{" "}
          {myCertificate && (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setMyCertificate(null)}
            >
              Close Preview
            </Button>
          )}
        </Typography>

        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {myCertificates.map(
              (certificate, index) =>
                certificate && (
                  <Grid item xs={6}>
                    <Item>
                      <Typography variant="h5">
                        Course: {certificate.courseTitle}
                      </Typography>
                      <Typography variant="body1">
                        Offered By: {certificate.issuerName}
                      </Typography>
                      <Typography variant="body1">
                        Status:{" "}
                        {certificate.verified ? "Verified" : "Not Verified Yet"}
                      </Typography>
                      {Number.parseInt(certificate.expireTs) ? (
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Expire:{" "}
                          {new Date(
                            Number.parseInt(certificate.expireTs)
                          ).toDateString()}
                        </Typography>
                      ) : null}

                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => setMyCertificate(certificate)}
                      >
                        View
                      </Button>
                    </Item>
                  </Grid>
                )
            )}
          </Grid>
        </Container>
      </>
    );
  } else if (page === "approve") {
    content = (
      <>
        <Typography variant="h4" gutterBottom component="div" sx={{ my: 4 }}>
          Unapproved Certificates
        </Typography>

        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {unapproved.map((certificate, index) => (
              <Grid item xs={12}>
                <Item>
                  <Typography variant="h6">
                    Owner: {certificate.ownerName}
                  </Typography>
                  <Typography variant="body1">
                    Owner ID: {certificate.owner}
                  </Typography>
                  <Typography variant="h6">
                    Course: {certificate.courseTitle}
                  </Typography>
                  <Typography variant="body1">
                    Offered By: {certificate.issuerName}
                  </Typography>
                  <Typography variant="body1">
                    Status:{" "}
                    {certificate.verified ? "Verified" : "Not Verified Yet"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Expire:{" "}
                    {new Date(
                      Number.parseInt(certificate.expireTs)
                    ).toDateString()}
                  </Typography>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => approveCertificate(certificate)}
                  >
                    Approve
                  </Button>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Container>
      </>
    );
  } else if (page === "verify") {
    content = (
      <>
        <Container maxWidth="sm" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
            Certificate Verification Portal
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Certificate ID"
              size="small"
              sx={{ my: 2 }}
              value={verCertId}
              onChange={(e) => {
                setVerCertId(e.target.value);
              }}
            />

            <TextField
              label="Owner Name"
              size="small"
              sx={{ my: 2 }}
              fullWidth
              value={verOwnerName}
              onChange={(e) => {
                setVerOwnerName(e.target.value);
              }}
            />

            <TextField
              label="Issuer Name"
              size="small"
              sx={{ my: 2 }}
              fullWidth
              value={verIssuerName}
              onChange={(e) => {
                setVerIssuerName(e.target.value);
              }}
            />

            <Button
              variant="contained"
              color="success"
              sx={{ width: "100%", my: 2 }}
              onClick={() => {
                registerSol.methods
                  .checkVerified(verCertId, verOwnerName, verIssuerName)
                  .call()
                  .then((isVerified) => {
                    setVerVerified(
                      (isVerified ? "Verified" : "Not Verified Yet") +
                        " Certificate"
                    );
                  })
                  .catch((e) => {
                    toast.dismiss();
                    toast.error("Error verifying certificate");
                  });
              }}
            >
              Verify
            </Button>
          </Box>

          <Typography
            variant="h4"
            sx={{ mt: 3, mb: 2, textAlign: "center" }}
            color="primary"
          >
            {verVerified}
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ marginBottom: "20px" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Health Care
            </Typography>
            {page !== "approve" && (
              <>
                <Button
                  color={"inherit"}
                  variant={page === "courses" && "outlined"}
                  onClick={() => setPage("courses")}
                >
                  Courses
                </Button>
                <Button
                  color={"inherit"}
                  variant={page === "certificates" && "outlined"}
                  onClick={() => setPage("certificates")}
                >
                  My Certificates
                </Button>
                <Button
                  color={"inherit"}
                  variant={page === "verify" && "outlined"}
                  onClick={() => setPage("verify")}
                  sx={{ mr: 2 }}
                >
                  Verify
                </Button>
              </>
            )}
            <p>
              account: {account.substring(0, 20)}... <br />
              balance: {balance / 1e18} ETH
            </p>
            {/*<Button color="inherit">Login</Button>*/}
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">{content}</Container>
      </Box>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;
