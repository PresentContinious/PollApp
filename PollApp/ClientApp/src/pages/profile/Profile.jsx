import {useEffect, useState} from "react";
import {apiEndpoint} from "../../api";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LinearProgress from '@mui/joy/LinearProgress';
import ResultsTable from "../../components/resultsTable/ResultsTable";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiEndpoint('user/me').fetch()
            .then(res => setUser({...res.data.user, average: res.data.average, message: res.data.message}))
            .catch(() => navigate('/sign-in'));
    }, []);

    return (
        <>
            {user &&
                <div style={{margin: '20px 30px'}}>
                    <Typography component="h1" variant="h4" align={'center'} gutterBottom>
                        Особистий кабінет
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name={"firstName"}
                                required
                                fullWidth
                                id="firstName"
                                label="Ім'я"
                                value={`${user.firstName}`}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Призвіще"
                                name={"lastName"}
                                autoComplete="family-name"
                                value={`${user.lastName}`}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                name={"userName"}
                                autoComplete="username"
                                value={`${user.userName}`}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                value={`${user.maritalStatus}`}
                                id="marital"
                                label="Сімейний стан"
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                value={`${user.occupation}`}
                                id="occupation"
                                InputProps={{readOnly: true}}
                                label="Сфера роботи"/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Пошта"
                                name={"email"}
                                InputProps={{readOnly: true}}
                                autoComplete="email"
                                value={`${user.email}`}
                            />
                        </Grid>
                    </Grid>
                    <div style={{margin: '20px'}}></div>
                    <Typography component="h1" variant="h5" align={'center'} gutterBottom>
                        Ваш прогрес: {user.average}%
                    </Typography>
                    <LinearProgress determinate value={user.average} sx={{"--LinearProgress-thickness": "50px"}}
                                    variant="soft"
                                    color={user.average > 51 ? "success" : "warning"}/>
                    <div style={{margin: '10px'}}></div>
                    <Typography component="h1" variant="h5" align={'center'} gutterBottom color={'text.secondary'}>
                        {user.message}
                    </Typography>
                    <div style={{margin: '20px'}}></div>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Ваші результати
                    </Typography>
                    <ResultsTable rows={user.testResults}/>
                </div>}
        </>
    )
}

export default Profile;