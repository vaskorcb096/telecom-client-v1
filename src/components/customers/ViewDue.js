import { Divider } from "@nextui-org/react"

const ViewDue = ({ onClose }) => {

    return (
        <div>
            <div className='flex flex-row text-sm font-bold'>
                <p className="basis-3/5">Order ID/Refferances</p>
                <p className="basis-2/5">Due/Total</p>
                <p className="basis-2/5">Date</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm'>
                <p className="basis-3/5">Previous Due</p>
                <p className="basis-2/5">2000</p>
                <p className="basis-2/5">November 16, 2023</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm'>
                <p className="basis-3/5">584818</p>
                <p className="basis-2/5">2000</p>
                <p className="basis-2/5">November 16, 2023</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm'>
                <p className="basis-3/5">584818</p>
                <p className="basis-2/5">2000</p>
                <p className="basis-2/5">November 16, 2023</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm'>
                <p className="basis-3/5">584818</p>
                <p className="basis-2/5">2000</p>
                <p className="basis-2/5">November 16, 2023</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm'>
                <p className="basis-3/5">584818</p>
                <p className="basis-2/5">2000</p>
                <p className="basis-2/5">November 16, 2023</p>
            </div>
            <Divider className="my-2" />
            <div className='flex flex-row text-sm font-bold'>
                <p className="basis-4/5">Current Due</p>
                <p className="basis-1/5">3000</p>
            </div>
        </div>
    )
}

export default ViewDue