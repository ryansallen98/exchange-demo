import { Box, Button, Chip, createTheme, Dialog, FormControl, MenuItem, Modal, Select, Stack, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { useState } from "react";

function CurrencyToggle({ value, onChange }) {
  const style = {
    borderRadius: '12px',
    height: '30px',
    textTransform: 'capitalize',
    fontWeight: 400
  };

  return (
    <ToggleButtonGroup
      value={value}
      onChange={onChange}
    >
      <ToggleButton
        value="fiat"
        sx={style}>
        Fiat
      </ToggleButton>
      <ToggleButton
        value="crypto"
        sx={style}>
        Crypto
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

function CurrencySelect({ currencies, value, onChange }) {
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={onChange}
      >
        {currencies.map((currency, index) => (
          <MenuItem key={index} value={currency.value}>
            <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
              {currency.name} {currency.type && <Chip size="small" label={currency.type} />}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}


const currencies = {
  fiat: [
    {
      name: 'USD',
      value: 'USD',
    },
    {
      name: 'GBP',
      value: 'GBP',
    },
    {
      name: 'EUR',
      value: 'EUR',
    }
  ],
  crypto: [
    {
      name: 'BTC',
      value: 'BTC',
    },
    {
      name: 'ETH',
      value: 'ETH',
    },
    {
      name: 'USDT',
      type: 'ERC20',
      value: 'USDT ERC20',
    },
    {
      name: 'USDT',
      type: 'TRC20',
      value: 'USDT TRC20',
    }
  ]
}

const exchangeRates = {
  fiat: {
    USD: {
      GBP: 0.76,
      EUR: 0.85,
      BTC: 0.067,
      ETH: 15,
      'USDT ERC20': 26000,
      'USDT TRC20': 26000,
      USD: 1,
    },
    GBP: {
      USD: 1.31,
      EUR: 1.12,
      BTC: 0.067,
      ETH: 15,
      'USDT ERC20': 26000,
      'USDT TRC20': 26000,
      GBP: 1,
    },
    EUR: {
      USD: 1.18,
      GBP: 0.89,
      BTC: 0.067,
      ETH: 15,
      'USDT ERC20': 26000,
      'USDT TRC20': 26000,
      EUR: 1,
    },
  },
  crypto: {
    BTC: {
      USD: 26000,
      GBP: 19800,
      EUR: 22000,
      ETH: 15,
      'USDT ERC20': 26000,
      'USDT TRC20': 26000,
      BTC: 1,
    },
    ETH: {
      USD: 1800,
      GBP: 1370,
      EUR: 1540,
      BTC: 0.067,
      'USDT ERC20': 26000,
      'USDT TRC20': 26000,
      ETH: 1,
    },
    'USDT ERC20': {
      USD: 1,
      GBP: 0.76,
      EUR: 0.85,
      BTC: 0.000038,
      ETH: 0.00056,
      'USDT TRC20': 1,
      'USDT ERC20': 1,
    },
    'USDT TRC20': {
      USD: 1,
      GBP: 0.76,
      EUR: 0.85,
      BTC: 0.000038,
      ETH: 0.00056,
      'USDT ERC20': 1,
      'USDT TRC20': 1,
    },
  }
};


export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#6CB7BB',
        light: '#F8F9FA',
        dark: '#4B8487',
        contrastText: '#fff',
      },
    },
  });


  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [type1, setType1] = useState('fiat');
  const [type2, setType2] = useState('fiat');
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('GBP');
  const [exchangeType, setExchangeType] = useState('sell');
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const fx = exchangeRates[type2][currency2][currency1];

  const handleType1 = (e) => {
    setType1(e.target.value);
    setCurrency1(currencies[e.target.value][0].name);
    handleAmount1({ target: { value: 0 } });
    handleAmount2({ target: { value: 0 } });
  }

  const handleType2 = (e, newValue) => {
    setType2(e.target.value);
    setCurrency2(currencies[e.target.value][1].name);
    handleAmount1({ target: { value: 0 } });
    handleAmount2({ target: { value: 0 } });
  }

  const handleCurrency1 = (e) => {
    setCurrency1(e.target.value);
    handleAmount1({ target: { value: 0 } });
    handleAmount2({ target: { value: 0 } });
  }

  const handleCurrency2 = (e) => {
    setCurrency2(e.target.value);
    handleAmount1({ target: { value: 0 } });
    handleAmount2({ target: { value: 0 } });
  }

  const handleAmount1 = (e) => {
    const value = e.target.value;
    setAmount1(value);
    if (type2 === 'fiat') { setAmount2((value / fx).toFixed(2)) } else {
      setAmount2(value / fx)
    }
    setExchangeType('sell');
  }

  const handleAmount2 = (e) => {
    const value = e.target.value;
    setAmount2(value);
    if (type1 === 'fiat') { setAmount1((value / fx).toFixed(2)) } else {
      setAmount1(value / fx)
    }
    setExchangeType('buy');
  }

  const handleSwap = () => {
    const tempAmount = amount1;
    const tempType = type1;
    const tempCurrency = currency1;

    setAmount1(amount2);
    setType1(type2);
    setCurrency1(currency2);

    setAmount2(tempAmount);
    setType2(tempType);
    setCurrency2(tempCurrency);

    if (exchangeType === 'sell') {
      setExchangeType('buy');
    } else {
      setExchangeType('sell');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack
        width={'100%'}
        height={'100dvh'}
        alignItems={'center'}
        justifyContent={'center'}
        bgcolor={'#F8F9FA'}
        fontFamily={'Roboto, sans-serif'}
      >
        <Stack
          borderRadius={'12px'}
          p={3}
          bgcolor={'white'}
          boxShadow={'0px 3.5px 5.5px rgba(0, 0, 0, 0.02)'}
          gap={2}
        >
          <Stack>
            <Typography variant={'h5'} fontWeight={400}>Exchange</Typography>
            <Stack direction={'row'} gap={1} alignItems={'center'} color="#A0AEC0">
              <Typography variant={'subtitle1'}>1.00 {currency1} = {exchangeRates[type2][currency2][currency1]} {currency2}</Typography><Tooltip arrow title="All rates are indicative* "><InfoIcon fontSize="1rem" /></Tooltip>
            </Stack>
          </Stack>
          <Stack position={'relative'}>
            <Stack gap={1} direction={'row'}>
              <Stack gap={1}>
                <CurrencyToggle value={type1} onChange={handleType1} />
                <CurrencySelect currencies={currencies[type1]} value={currency1} onChange={handleCurrency1} />
                <TextField size="small" placeholder="Buy Amount" type="number" value={amount1} onChange={handleAmount1} />
              </Stack>
              <Stack gap={1}>
                <CurrencyToggle value={type2} onChange={handleType2} />
                <CurrencySelect currencies={currencies[type2]} value={currency2} onChange={handleCurrency2} />
                <TextField size="small" placeholder="Sell Amount" type="number" value={amount2} onChange={handleAmount2} />
              </Stack>
            </Stack>
            <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
              <ChangeCircleIcon
                onClick={handleSwap}
                sx={{
                  position: 'absolute',
                  top: '45%',
                  fontSize: '50px',
                  bgcolor: 'white',
                  borderRadius: '100%',
                  boxShadow: '0px 3.5px 5.5px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  color: '#6CB7BB',
                  '&:hover': {
                    bgcolor: '#F8F9FA',
                    color: '#4B8487'
                  }
                }}
              />
            </Stack>
          </Stack>
          <Typography variant={'body2'} color="#A0AEC0">Request a {exchangeType} {exchangeType === "sell" ? `of ${amount1} ${currency1}` : `for ${amount2} ${currency2}`}</Typography>
          <Box>
            <Button variant={'contained'} onClick={toggleModal}>Request Exchange</Button>
            <Dialog open={modalOpen} onClose={toggleModal}>
              <Stack p={3} gap={2}>
                <Typography variant={'h5'}>Exchange Request</Typography>
                <Typography variant={'body2'}>Request a {exchangeType} {exchangeType === "sell" ? `of ${amount1} ${currency1}` : `for ${amount2} ${currency2}`}</Typography>
              </Stack>
            </Dialog>
          </Box>
        </Stack>
      </Stack>
    </ThemeProvider>
  )
}
