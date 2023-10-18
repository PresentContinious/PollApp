import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";

const Results = ({resultsWrap}) => {
    const results = resultsWrap.userResults;
    const left = resultsWrap.left;

    return (
        <Card variant={'outlined'} sx={{pt: 3, pb: 3}}>
            <CardContent>
                <Typography sx={{display: 'flex', justifyContent: 'center', mb: 3}} variant={'h4'}>
                    {'Результати тесту: '} <b>{` ${results.test.name}`}</b>
                </Typography>
                <Typography sx={{display: 'flex', justifyContent: 'center', mb: 3}} variant={'h4'}
                            color={'text.secondary'}>
                    Набрано балів: {results.score} з {results.test.maxPoints}
                </Typography>
                <Typography sx={{display: 'flex', justifyContent: 'center', mb: 3}} variant={'h4'}
                            color={'text.secondary'}>
                    У вас залишилось {left} спроб
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Results;