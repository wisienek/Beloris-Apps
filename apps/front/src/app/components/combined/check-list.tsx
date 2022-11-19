import {
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  styled,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import React from 'react';

const TimelineWrapper = styled(Timeline)(
  ({ theme }) => `
    margin-left: ${theme.spacing(1)};

    .MuiTimelineDot-root {
      left: -${theme.spacing(2)};
      margin-top: 0;
      top: ${theme.spacing(0.5)};
    }

    .MuiTimelineContent-root {
      padding-left: ${theme.spacing(4)};
    }

    .MuiFormControlLabel-root {
      margin-left: -${theme.spacing(0.7)};
    }

    .MuiFormControlLabel-label {
      color: ${theme.colors.alpha.black[50]};
    }
`,
);

const CheckboxWrapper = styled(Checkbox)(
  ({ theme }) => `
    padding: ${theme.spacing(0.5)};
`,
);

export interface CheckListTask {
  id?: string | number;
  name: string;
  label: string;
  checked: ((...args: any[]) => boolean) | boolean;
}

export interface CheckListContent {
  header: string;
  tasks: CheckListTask[];
  icon: React.ReactNode;
}

export interface CheckListArgs {
  contents: CheckListContent[];
}

function Checklist({ contents }: CheckListArgs) {
  return (
    <TimelineWrapper>
      {contents.map((content, id) => (
        <TimelineItem key={`content-${content.header}-${id}`}>
          <TimelineSeparator>
            <TimelineDot color="primary">{content.icon}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography
              variant="h5"
              sx={{
                pb: 2,
                overflowWrap: 'nowrap',
              }}
            >
              {content.header}
            </Typography>
            <FormGroup>
              {content.tasks.map((task) => (
                <FormControlLabel
                  key={`task-${task.id ?? task.name}`}
                  control={
                    <CheckboxWrapper
                      color="primary"
                      name={task.name}
                      checked={
                        typeof task.checked === 'boolean'
                          ? task.checked
                          : task.checked()
                      }
                      disabled
                    />
                  }
                  label={task.label}
                />
              ))}
            </FormGroup>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineWrapper>
  );
}

export default Checklist;
