import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Box, useTheme } from '@mui/material';

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

export interface TransferListArgs {
  allItems: Record<number, string>;
  selectedLeft: readonly number[];
  selectedRight: readonly number[];
  setParentRight?: (args: number[]) => void;
  setParentLeft?: (args: number[]) => void;
  accept?: () => void;
}

export default function TransferList({
  selectedLeft,
  selectedRight,
  allItems,
  setParentRight,
  setParentLeft,
  accept,
}: TransferListArgs) {
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>(selectedLeft);
  const [right, setRight] = React.useState<readonly number[]>(selectedRight);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) => intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const _left = not(left, leftChecked);
    const _right = right.concat(leftChecked);

    setRight(_right);
    setLeft(_left);
    setChecked(not(checked, leftChecked));

    setParentRight && setParentRight(_right);
    setParentLeft && setParentLeft(_left);
  };

  const handleCheckedLeft = () => {
    const _left = left.concat(rightChecked);
    const _right = not(right, rightChecked);

    setLeft(_left);
    setRight(_right);
    setChecked(not(checked, rightChecked));

    setParentRight && setParentRight(_right);
    setParentLeft && setParentLeft(_left);
  };

  const handleAccept = () => {
    accept();
    setLeft([]);
  };

  const customList = (title: React.ReactNode, items: readonly number[]) => (
    <Card sx={{ flexGrow: 1 }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'wszystkie wybrane',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} Wybranych`}
      />
      <Divider />
      <Box sx={{ maxHeight: '45vh', overflowY: 'auto' }}>
        <List
          sx={{
            bgcolor: 'background.paper',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((value: number) => {
            const labelId = `transfer-list-all-item-${allItems[value]}-label`;

            return (
              <ListItem key={`${title}-${value}`} role="listitem" button onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={allItems[value]} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Box>
    </Card>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="stretch"
        sx={{
          maxWidth: '100%',
          margin: '0 auto',
          gap: 2,
        }}
      >
        <Grid item xs={12} md={4}>
          {customList('Do wyboru', left)}
        </Grid>
        <Grid item xs={3} md={1}>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="przenieś do wybranych"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="przenieś do wszystkich"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          {customList('Wybrane', right)}
        </Grid>
      </Grid>

      <Button
        sx={{ my: 0.5, mt: 2, width: '20%', minWidth: '138px' }}
        variant="contained"
        size="large"
        aria-label="zaakceptuj"
        onClick={() => handleAccept()}
      >
        Zaakceptuj
      </Button>
    </Box>
  );
}
