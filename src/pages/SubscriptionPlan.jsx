import TopHeader from "../components/global/TopHeader"
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useState } from "react";
import MonthlyPlan from "../components/global/MonthlyPlan";
import YearlyPlan from "../components/global/YearlyPlan";

const SubscriptionPlan = () => {
    const [active, setActive] = useState(false)
    return (
        <>
            <TopHeader title="Business Profile" description="below is a business overview" />
            <Container maxWidth="lg">
                <div className='card-box-shadow px-5 py-4 mb-4'>
                    <p className='sub-plan-title text-center'>SUBSCRIPTION PLANS</p>
                    <p className="branches-desc text-center">Choose your subscription types</p>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} className="mt-3 mb-4">
                        <h2 className="sub-plan-yearly">Monthly</h2>
                        <Switch defaultChecked={active} onClick={() => setActive(!active)} />
                        <h2 className="sub-plan-yearly">Yearly</h2>
                    </Stack>
                    {active ? <YearlyPlan /> : <MonthlyPlan />}
                </div>
            </Container>
        </>
    )
}

export default SubscriptionPlan