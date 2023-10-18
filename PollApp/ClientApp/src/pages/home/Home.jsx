import styles from './home.module.css';
import * as React from "react";
import {useEffect, useState} from "react";
import {apiEndpoint} from "../../api";
import {useNavigate} from "react-router-dom";
import {Typography} from "@mui/material";

const Home = () => {
    const [tests, setTests] = useState([]);
    const [leftTries, setLeftTries] = useState(null);

    useEffect(() => {
        apiEndpoint('poll').fetch().then(res => {
            setTests(res.data.polls);
            setLeftTries(res.data.leftTries);
        });
    }, [])

    if (!tests)
        return (<></>);

    return (
        <div className={styles.wrap}>
            <Typography component="h1" variant="h3" align={'center'} gutterBottom color={'text.secondary'}>
                Вітаємо на сайті !
            </Typography>
            {tests.map((test, index) => <TestWrap key={'test' + test.id} test={test} index={index}
                                                  leftTries={leftTries}/>)}
        </div>
    )
}

const TestWrap = ({test, index, leftTries}) => {
    const navigate = useNavigate();

    const _styles = [
        {background: 'linear-gradient(45deg, #151757 30%, #691bde 90%)'},
        {background: 'linear-gradient(45deg, #4d135d 30%, #ad1bde 90%)'},
        {background: 'linear-gradient(45deg, #13325d 30%, #1baade 90%)'},
        {background: 'linear-gradient(45deg, #5d1324 30%, #de1b5f 90%)'},
        {background: 'linear-gradient(45deg, #5d2f13 30%, #deb11b 90%)'},
    ]

    return (
        <>
            <div className={styles.testWrap} style={_styles[index % 5]}>
                <div style={{padding: '30px'}}>
                    <Typography component="div" variant="h4" gutterBottom color={'white'}>
                        Тест: {test.name}
                    </Typography>
                    <Typography component="div" variant="h5" gutterBottom mt={2} color={'white'}>
                        {test.description}
                    </Typography>
                    <Typography component="div" variant="h6" mt={2} gutterBottom color={'white'}>
                        {test.questions.length} питань
                    </Typography>
                    <Typography component="div" variant="h6" mt={2} gutterBottom color={'white'}>
                        Залишилось {leftTries[test.id] ?? test.maxTries} з {test.maxTries} спроб
                    </Typography>
                    {leftTries[test.id] === 0 && <div className={styles.buttons}>
                        <div className={styles.button} onClick={() => navigate(`test/${test.id}`)}>
                            Пройти Тест <ion-icon name="arrow-forward-circle-outline"></ion-icon>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Home;