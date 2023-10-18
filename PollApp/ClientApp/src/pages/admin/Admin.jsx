import {useState} from "react";
import {Box, Card, CardContent, Checkbox, FormControl, FormControlLabel} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from '@mui/lab/LoadingButton';
import {apiEndpoint} from "../../api";
import {launchError, launchSuccess} from "../../components/layout/Layout";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {getRandomId} from "../../imports/text";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [test, setTest] = useState({
        name: '',
        description: '',
        maxTries: 2
    });
    const [questions, setQuestions] = useState([{
        id: 'random_question',
        name: '',
        file: null,
        answers: [{id: 'random_answer', name: '', weight: 0},
            {id: 'random_second', name: '', weight: 0}]
    }]);

    const handleSubmit = (event) => {
        event.preventDefault();
        test.questions = questions;

        const formData = new FormData();
        for (const testKey in test) {
            if (typeof test[testKey] === 'object') {
                for (const questionIndex in test[testKey]) {
                    if (typeof test[testKey][questionIndex] === 'object') {
                        for (const questionKey in test[testKey][questionIndex]) {
                            if (questionKey === 'file') {
                                formData.append(`${testKey}[${questionIndex}].File`, test[testKey][questionIndex][questionKey]);
                            } else if (typeof test[testKey][questionIndex][questionKey] === 'object') {
                                for (const answerIndex in test[testKey][questionIndex][questionKey]) {
                                    for (const answerKey in test[testKey][questionIndex][questionKey][answerIndex])
                                        formData.append(`${testKey}[${questionIndex}][${questionKey}][${answerIndex}][${answerKey}]`, test[testKey][questionIndex][questionKey][answerIndex][answerKey]);
                                }
                            } else
                                formData.append(`${testKey}[${questionIndex}][${questionKey}]`, test[testKey][questionIndex][questionKey]);
                        }
                    }
                }
            } else
                formData.append(testKey, test[testKey]);
        }

        setLoading(true);
        apiEndpoint('admin', true).post(formData).then(() => {
            setLoading(false);
            launchSuccess('New test added successfully!');
            navigate(0);
        }).catch(err => {
            setLoading(false);
            launchError(err);
        });
    }

    const addQuestion = () => {
        setQuestions(questions.concat({
            id: getRandomId(),
            name: '',
            file: null,
            answers: [{id: 'random_answer', name: '', weight: 0},
                {id: 'random_second', name: '', weight: 0}]
        }));
    }

    return (
        <>
            <Typography variant={'h3'} mb={3} component={'div'} justifyContent={'center'}>
                Додати Новий Тест
            </Typography>
            <TextField onChange={e => setTest({...test, name: e.target.value})} label={'Назва тесту'} fullWidth/>
            <TextField onChange={e => setTest({...test, description: e.target.value})} label={'Опис'} fullWidth
                       multiline maxRows={3} sx={{mt: 3}}/>
            <TextField onChange={e => setTest({...test, maxTries: +e.target.value})}
                       label={'Кількість спроб'} sx={{mt: 3}}
                       defaultValue={2}
                       InputProps={{type: 'number', step: 1, min: 1}}/>
            <div></div>
            <Button onClick={addQuestion} sx={{mt: 3}}>Додати питання</Button>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
                <div style={{display: 'flex', gap: '30px', flexDirection: 'column'}}>
                    {questions.map((question, index) =>
                        <QuestionWrap question={question} index={index + 1} key={question.id}
                                      setQuestions={setQuestions} questions={questions}/>)}
                </div>
                <div style={{margin: '20px 0'}}></div>
                <LoadingButton
                    size={'large'}
                    type="submit"
                    sx={{mb: 4}}
                    endIcon={<SendIcon/>}
                    loading={loading}
                    loadingPosition="end"
                    variant="contained">
                    <span>Додати Тест</span>
                </LoadingButton>
            </Box>
        </>
    )
}

const QuestionWrap = ({question, index, setQuestions, questions}) => {
    const addAnswer = () => {
        question.answers.push({id: getRandomId(), name: '', weight: 0});
        setQuestions([...questions]);
    }

    const handleWeightChange = (event, id) => {
        question.answers.filter(a => a.id === id)[0].weight = event.target.checked ? 1 : 0;
        setQuestions([...questions]);
    }

    const handleAnswerChange = (event, id) => {
        question.answers.filter(a => a.id === id)[0].name = event.target.value;
        setQuestions([...questions]);
    }

    const handleQuestionChange = (event) => {
        question.name = event.target.value;
        setQuestions([...questions]);
    }

    const handleFile = (event) => {
        question.file = event.target.files[0];
        setQuestions([...questions]);
    }

    return (
        <>
            <Box sx={{minWidth: 300}}>
                <Card variant={'outlined'}>
                    <CardContent>
                        <TextField defaultValue={question.name}
                                   onChange={handleQuestionChange}
                                   label={'Назва питання'}
                                   sx={{mb: 1}}
                                   fullWidth/>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={10}>
                                <TextField
                                    required
                                    id="fileName"
                                    name="fileName"
                                    label="Зображення"
                                    value={question.file?.name || ''}
                                    onChange={e => question.file.name = e.target.value}
                                    InputProps={{readOnly: true}}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                                    <input
                                        hidden
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        id={"raised-button-file" + question.id}
                                        type="file"
                                        onChange={handleFile}
                                    />
                                    <label htmlFor={"raised-button-file" + question.id}>
                                        <Button variant="contained" component="span" size={'large'}>
                                            Завантажити
                                        </Button>
                                    </label>
                                </div>
                            </Grid>
                        </Grid>
                        <Typography sx={{mb: 1.5}} color={"text.secondary"}>
                            Питання {index}
                        </Typography>
                        <FormControl>
                            {question.answers.map(answer =>
                                <FormControlLabel control={<Checkbox color="success"/>} sx={{mb: 1.5}}
                                                  onChange={e => handleWeightChange(e, answer.id)}
                                                  label={<TextField label={'Введіть відповідь'}
                                                                    onChange={e => handleAnswerChange(e, answer.id)}
                                                                    fullWidth/>}
                                                  key={answer.id + 'Answer'} value={answer.id}/>
                            )}
                        </FormControl>
                        <div style={{margin: '20px 0'}}></div>
                        <Button onClick={addAnswer}>Додати відповідь</Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default Admin;
