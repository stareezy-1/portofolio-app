import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSendContact } from "@/lib/hooks/useContent";
import styles from "./ContactForm.style";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const sendContact = useSendContact();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiError(null);
    try {
      await sendContact.mutateAsync({ name, email, message });
      onSubmit?.({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setApiError(
        err?.response?.data?.error?.message ??
          "Failed to send. Please try again.",
      );
    }
  };

  return (
    <View accessibilityLabel="Contact form">
      <Text style={styles.eyebrow}>Let's Connect</Text>
      <Text style={styles.heading}>Get in Touch</Text>
      <Text style={styles.subheading}>
        Have a project in mind or just want to say hi? I'd love to hear from
        you.
      </Text>

      <View style={styles.card}>
        {submitted && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>
              ✓ Message sent! I'll get back to you soon.
            </Text>
          </View>
        )}
        {apiError && (
          <View
            style={[
              styles.successBanner,
              {
                backgroundColor: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.2)",
              },
            ]}
          >
            <Text style={[styles.successText, { color: "#EF4444" }]}>
              {apiError}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#334155"
              accessibilityLabel="Name"
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#334155"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>MESSAGE</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.message ? styles.inputError : null,
            ]}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell me about your project or idea..."
            placeholderTextColor="#334155"
            multiline
            numberOfLines={5}
            accessibilityLabel="Message"
          />
          {errors.message ? (
            <Text style={styles.errorText}>{errors.message}</Text>
          ) : null}
        </View>

        <Pressable
          style={[
            styles.submitButton,
            sendContact.isPending && styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={sendContact.isPending}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          {sendContact.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Send Message →</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
