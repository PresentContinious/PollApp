import {useNavigate, useParams} from "react-router-dom";
import {apiEndpoint} from "../../api";
import {useEffect, useMemo, useState} from "react";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {
    Box,
    Card,
    CardContent, Checkbox,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {formatFile, getFormData} from "../../imports/text";
import LoadingButton from '@mui/lab/LoadingButton';
import {launchError} from "../../components/layout/Layout";
import Results from "../../components/results/Results";

const Test = () => {
    const navigate = useNavigate();
    const {testId} = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        apiEndpoint('poll').fetchById(testId)
            .then((res) => setTest(res.data))
            .catch(() => navigate('/sign-in'));
    }, [navigate, testId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = {testId, answers: []};
        const formData = getFormData(event.target, true);
        for (const dataKey in formData) {
            data.answers.push({questionId: dataKey, answerIds: formData[dataKey]});
        }

        apiEndpoint('poll').post(data).then(res => {
            setLoading(false);
            setResult(res.data);
        }).catch(err => {
            setLoading(false);
            launchError(err);
        });
    }

    if (!test)
        return (<></>);

    if (result)
        return (<Results results={result}/>);

    return (
        <>
            <div style={{margin: '20px 30px'}}>
                <Typography component="h1" variant="h4" align={'center'} gutterBottom>
                    {test.name}
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <div style={{display: 'flex', gap: '30px', flexDirection: 'column'}}>
                        {test.questions.map((question, index) => <QuestionWrap question={question} index={index + 1}
                                                                               key={question.name}/>)}
                    </div>
                    <div style={{margin: '20px 0'}}></div>
                    <LoadingButton
                        size={'large'}
                        type="submit"
                        endIcon={<SendIcon/>}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        <span>Зберегти Відповіді</span>
                    </LoadingButton>
                </Box>
            </div>
        </>
    )
}

const QuestionWrap = ({question, index}) => {
    const [answers, setAnswers] = useState([]);

    const handleChange = (event, id) => {
        if (event.target.checked) {
            if (answers.length >= question.correctAnswers)
                answers.pop();

            setAnswers(answers.concat(id));
        } else
            setAnswers(answers.filter(answer => answer !== id));
    }

    const isChecked = (id) => {
        return answers.includes(id);
    }

    return (
        <>
            <Box sx={{minWidth: 300}}>
                <Card variant={'outlined'}>
                    <CardContent>
                        {question.fileId && <img src={formatFile(question.fileId)} alt={question.fileName} style={{
                            maxWidth: '100%',
                            margin: '0 auto',
                            height: 'auto',
                        }}/>}
                        <Typography component="div" variant="h5">
                            {question.name}
                        </Typography>
                        <Typography sx={{mb: 1.5}} color={"text.secondary"}>
                            Питання {index} {question['isComplex'] && `(Оберіть ${question.correctAnswers} правильних відповідей)`}
                        </Typography>
                        <FormControl>
                            {question['isComplex'] ?
                                <>
                                    {question.answers.map(answer =>
                                        <FormControlLabel control={<Checkbox checked={isChecked(answer.id)}
                                                                             onChange={e => handleChange(e, answer.id)}/>}
                                                          sx={{mb: 1.5}}
                                                          name={question.id.toString()}
                                                          label={answer.name}
                                                          key={answer.id + 'Answer'} value={answer.id}/>
                                    )}
                                </>
                                : <RadioGroup name={question.id.toString()}>
                                    {question.answers.map(answer =>
                                        <FormControlLabel control={<Radio/>} label={answer.name}
                                                          key={answer.id + 'Answer'} value={answer.id}/>)}
                                </RadioGroup>}
                        </FormControl>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default Test;