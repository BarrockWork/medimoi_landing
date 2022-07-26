import Head from 'next/head'
import Link from 'next/link'
import {useState, useEffect} from 'react'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { SelectField, TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo';
import {apiAxios} from "@/assets/axios";

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Register() {

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const first_name = document.querySelector("#first_name").value
    const last_name = document.querySelector('#last_name').value
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    const cellphone = document.querySelector('#cellphone').value
    const homephone = document.querySelector('#homephone').value
    const age = document.querySelector('#age').value
    const status = document.querySelector('#status').value

    try {
      const results = await apiAxios.post('/api/auth/signup', {
        firstName: first_name,
        lastName: last_name,
        age,
        cellphone,
        homephone,
        email,
        password,
        user_type_id: status,
      })
      // console.log(JSON.stringify(results.data.newUser))
      localStorage.setItem("user", JSON.stringify(results.data.newUser))
      // alert("votre compte à été créé")

      const session = await fetch("/api/checkout_sessions", {
        method: "POST"
      })
      console.log(session)
      window.location.href = session.url;

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Head>
        <title>Inscription - Medi'moi</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              S'inscrire maintenant
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Vous possedez déjà un compte?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Connectez vous.
              </Link>{' '}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2"
        >
          <TextField
            label="First name"
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <TextField
            // className="col-span-full"
            label="Cellphone"
            id="cellphone"
            name="cellphone"
            type="text"
            autoComplete="cellphone"
            required
          />
          <TextField
            // className="col-span-full"
            label="Homephone"
            id="homephone"
            name="homephone"
            type="text"
            autoComplete="homephone"
            required
          />
          <TextField
            className="col-span-full"
            label="Age"
            id="age"
            name="age"
            type="number"
            autoComplete="age"
            required
          />
          <SelectField
            className="col-span-full"
            label="Votre status: "
            id="status"
            name="status"
          >
            <option value="1">Professionnel</option>
            <option value="2">Particulier</option>
          </SelectField>
          <div className="col-span-full">
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              <span>
                S'inscrire <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
        </form>

        <form action="/api/checkout_sessions" method="post">
          <Button
            type="submit"
            variant="solid"
            color="orange"
            className="w-full mt-2 disabled:opacity-75 cursor-not-allowed"
          >
            <span>
              Proceder au paiement <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </form>

      </AuthLayout>
    </>
  )
}
