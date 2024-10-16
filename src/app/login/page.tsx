"use client";

import { useEffect } from "react";

export default function Login(){
    useEffect(() => {
        window.location.href = '/api/login';
    }, [])
}