"use client"
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { socialLogo } from "@/constants"

export default function Contact() {
  return (
    <section className="py-12 px-4 md:px-16 lg:px-20 bg-primary text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Contactez-Nous</h2>
      
      {/* <div className="flex items-center justify-center w-full gap-3 md:gap-4 md:mb-6">
                <div className="p-2 md:p-3 bg-card gap-x-1 *md:gap-x-2 flex items-center rounded-lg">
                  <h3 className="text-lg font-semibold">
                    <Mail className="h-5 w-5 text-primary" />
                  </h3>
                  <p className="text-gray-400 ml-1 md:ml-1.5">freddymk.se@gmail.com</p>
                </div>
                <div className="p-2 md:p-3 bg-card flex items-center rounded-lg">
                  <h3 className="text-lg font-semibold">
                    <Phone className="h-5 w-5 text-primary" />
                  </h3>
                  <p className="text-gray-400 ml-1 md:ml-1.5">+243991040032</p>
                </div>
              </div> */}
      
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          <div>
            <Label htmlFor="name">
              Nom
            </Label>
            <Input
              type="text"
              id="name"
              className="text-sm bg-white text-primary"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              className="text-sm bg-white text-primary"
              placeholder="Votre adresse email"
            />
          </div>
          <div>
            <Label htmlFor="message">
              Message
            </Label>
            <Textarea
              id="message"
              rows={5}
              className="text-sm bg-white text-primary"
              placeholder="Votre message"
            />
          </div>
          <Button
            type="submit"
            size={"xl"}
            className="w-full bg-white text-primary hover:bg-white/60 hover:text-primary"
          >
            Envoyer
          </Button>
        </form>
      </div>
      
      <div className="mt-8 flex items-center justify-center">
                <div className="">
                  <motion.div
                    className="flex flex-row gap-3 ml-5"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {socialLogo.map((sclog) => (
                      <a key={sclog.id} href={sclog.href}>
                        <motion.div
                          className="flex items-center justify-center rounded-full bg-card text-muted-foreground p-3 shadow-md cursor-pointer transition-colors duration-300 hover:"
                          whileHover={{
                            scale: 1.2,
                            rotate: 5,
                          }}
                          whileTap={{ scale: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}
                        >
                          <div className="group">
                            <sclog.logo className="h-[18px] w-[18px] transition-colors duration-300 group-hover:text-foreground" />
                          </div>
                        </motion.div>
                      </a>
                    ))}
                  </motion.div>
                </div>
              </div>
    </section>
  );
}
