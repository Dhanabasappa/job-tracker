import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette:{
        mode:"light",
        primary:{main:"#6366f1",light:"#818cf8",dark:"#4f46e5",contrastText:"#ffffff",},
        secondary:{main:"#ec4899",light:"#f472b6",dark:"#db2777",},
        background:{default:"#f8fafc",paper:"#ffffff",},
        status:{wishlist:"#94a3b8",applied:"#3b82f6",interviewing:"#f59e0b",offer:"#10b981",rejected:"#ef4444",},
    },
    typography:{
        fontFamily:'"Inter","Roboto","Helvetica","Arial",sans-serif',
        h1:{fontSize:"2.5rem",fontWeight:700,letterSpacing:"-0.02em",},
        h2:{fontSize:"2rem",fontWeight:600,},
        h3:{fontSize:"1.5rem",fontWeight:600,},
        button:{textTransform:"none",fontWeight:600,},
    },
    shape:{borderRadius:12,},
    shadows:[
        "none",
        "0px 1px 2px rgba(0, 0, 0, 0.5)",
        "0px 1px 3px rgba(0,0,0,0.1)",
        "0px 4px 6px -1px rgba(0,0,0,0.1)",
        "0px 10px 15px -3px rgba(0,0,0,0.1)",
        "0px 20px 25px -5px rgba(0,0,0,0.1)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
        "0px 25px 50px -12px rgba(0,0,0,0.25)",
    ],
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius:8,
                    padding:"10px 24px",
                    boxShadow:"none",
                    "&:hover":{boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",},
                },
            },
        },
        MuiCard:{
            styleOverrides:{
                root:{
                    borderRadius:12,
                    boxShadow:"0 1px 3px 0 rgba(0,0,0,0.1)",
                    "&:hover":{boxShadow:"0 10px 15px -3px rgba(0,0,0,0.1)",
                            transform:"translateY(-2px)",
                            transition:"all 0.3s ease-in-out",
                    },
                },
            },
        },
    },
});
export default theme;