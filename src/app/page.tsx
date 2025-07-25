'use client'

import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { LoginAction } from "@/app/actions/form-action";

const Login: NextPage = () => {
    return (
        <div>
            <form className="flex flex-col justify-center items-center min-h-screen mx-10" action={LoginAction}>
                <div className="bg-cyan-50 p-22">
                    <div>
                        <h1 className="text-5xl">Login</h1>
                    </div>

                    <div className="mb-5">
                        <div className="">
                            <h1>mail address</h1>
                        </div>
                        <input className="rounded-lg border-2 bg-white w-64 p-1" name="mailAddress"></input>
                    </div>

                    <div className="mt-5 mb-20">
                        <div>
                            <h1>password</h1>
                        </div>
                        <input className="rounded-lg outline-2 bg-white w-64 p-1" name="password"></input>
                    </div>

                    <div className="flex flex-row ">
                        <Button className="mt-4" type="submit">
                            Login
                        </Button>

                        <Button className="mt-4">
                            Register
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default Login