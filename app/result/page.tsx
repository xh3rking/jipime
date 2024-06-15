'use client'
import Upvote from "@/app/ui/home/Donate"
import { useState, useEffect } from "react"
import LoadingModal from "../ui/Loading";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'
export default function Result () {
    // soon to be the funniest component
    const [ userResults , setUserResults ] = useState({iq: 0, percentile: 0});
    const [isLoading, setIsLoading] = useState(false);
    // if user has no cookie/userId, they can't get their results thus its better if they get redirected to home page
    const router = useRouter();
    useEffect(() => {
        const cookie = Cookies.get('userId')
        if ( !cookie ) {
            router.push("/")
        }
    }, [router])
    // rewrite to async operation, then add loading state
    useEffect(() => {
        const fetchUserResults = () => {
            fetch ( "/api/total", {
                method: "GET",
            })
            .then((response) => {
                if ( response.ok ) {
                    return response.json()
                }else {
                    throw new Error("Error fetching results!")
                }
            }).then((data) => {
                console.log(data);
                setUserResults({iq:data.iq, percentile: data.percentile});
            }).catch((error) => {
                alert(error.message);
                console.error(error)
            })
            }
        fetchUserResults();
    }, [])
    return (
        <>
            <div className="text-center my-5" style={{minHeight: "100vh"}}>
                {userResults ? (
                    <>
                        <h2 className="text-3xl">It&apos;s <b>{userResults.iq}</b></h2>
                        <p className="my-5">You IQ was measured to be <b>{userResults.iq}</b> which is equivalent to the <b>{Math.round(userResults.percentile)}</b>th percentile, 
                        with a standard deviation of <b>15</b></p>
                        <p className="my-3">In a room filled with 1000 people, you&apos;d be position <b>{Math.round(100 - userResults.percentile) * 10}</b></p>
                    </>
                ) : (
                        <LoadingModal isOpen={isLoading} />
                )}
                <p className="my-3">Great test, yes? Give me money</p>
                <Upvote />
            </div>
        </>
    )
}