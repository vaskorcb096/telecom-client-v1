"use client"

import CardItem from "@/components/Home/CardItem";
import { cardsData } from "@/components/Home/data";
import LatestTransaction from "@/components/Home/LatestTransaction";

const Dashboard = () => {
    return (
        <div>
            <CardItem cardsData={cardsData}></CardItem>
            <div className="mt-10">
                <h3 className="mb-4 font-extrabold text-md sm:text-lg">Recently Added Products</h3>
                <LatestTransaction />
            </div>
        </div>
    )
}

export default Dashboard