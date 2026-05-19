"use client";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSendContact } from "@/lib/hooks/useContent";
import { isValidEmail, sanitizeFormField } from "@/lib/utils/validators";
import { aurora } from "@/lib/constants/aurora";
import styles from "./ContactForm.style";

const PROJECT_TYPES = [
  "Web App",
  "Mobile App",
  "Design System",
  "Consulting",
  "Other",
];
const BUDGET_RANGES = [
  "< $5k",
  "$5k–$15k",
  "$15k–$50k",
  "$50k+",
  "Let's discuss",
];

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

const SELECT_CSS = `
  .aurora-select {
    width: 100%;
    padding: 12px 14px;
    background-color: rgba(5,5,5,0.88);
    color: ${aurora.starWhite.value};
    border: 1.5px solid ${aurora.borderSubtle.value};
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }
  .aurora-select:focus { border-color: ${aurora.auroraGreen.value}; }
  .aurora-select.error { border-color: ${aurora.errorRed.value}; }
  .aurora-select option { background-color: #0a0a1a; color: ${aurora.starWhite.value}; }

  .aurora-form-row {
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin-bottom: 20px;
  }
  .aurora-form-row > .aurora-field {
    flex: 1;
    min-width: 0;
    margin-bottom: 0;
  }
  .aurora-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
  }

  @media (max-width: 560px) {
    .aurora-form-row { flex-direction: column; gap: 0; margin-bottom: 0; }
    .aurora-form-row > .aurora-field { margin-bottom: 20px; }
  }
`;

export function ContactForm() {
  const sendContact = useSendContact();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!sanitizeFormField(name)) e.name = "Name is required";
    if (!sanitizeFormField(email)) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Invalid email format";
    if (!projectType) e.projectType = "Please select a project type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiError(null);
    try {
      await sendContact.mutateAsync({
        name: sanitizeFormField(name),
        email: sanitizeFormField(email),
        message: sanitizeFormField(message),
        projectType,
        budget: budget || undefined,
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setProjectType("");
      setBudget("");
      setMessage("");
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message;
      const status = err?.response?.status;
      if (status === 0 || !status) {
        setApiError(
          "Network error — please check your connection and try again.",
        );
      } else if (status >= 500) {
        setApiError("Server error — please try again in a moment.");
      } else {
        setApiError(msg ?? "Failed to send. Please try again.");
      }
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.container} accessibilityLabel="Contact form success">
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEyebrow}>Message Sent</Text>
            <Text style={styles.cardTitle}>Thanks for reaching out!</Text>
            <Text style={styles.cardSubtitle}>
              I&apos;ll get back to you within 24 hours.
            </Text>
          </View>
          <View style={styles.successBanner}>
            <Text style={{ fontSize: 18, color: aurora.auroraGreen.value }}>
              ✓
            </Text>
            <Text style={styles.successText}>
              Your message has been sent successfully. Looking forward to
              connecting!
            </Text>
          </View>
          <View style={styles.submitArea}>
            <Pressable
              style={styles.submitButton}
              onPress={() => setSubmitted(false)}
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>Send Another Message</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container} accessibilityLabel="Contact form">
      {typeof window !== "undefined" && <style>{SELECT_CSS}</style>}

      <View style={styles.card}>
        {/* Card header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardEyebrow}>Let&apos;s Connect</Text>
          <Text style={styles.cardTitle}>Get in Touch</Text>
          <Text style={styles.cardSubtitle}>
            Have a project in mind? Fill out the form and I&apos;ll get back to
            you within 24 hours.
          </Text>
        </View>

        {/* API error banner */}
        {apiError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerIcon}>⚠</Text>
            <Text style={styles.errorBannerText}>{apiError}</Text>
            <Pressable
              onPress={() => setApiError(null)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss error"
            >
              <Text
                style={{
                  color: aurora.textMuted.value,
                  fontSize: 16,
                  paddingLeft: 8,
                }}
              >
                ✕
              </Text>
            </Pressable>
          </View>
        )}

        {/* Name + Email row */}
        {typeof window !== "undefined" ? (
          <div className="aurora-form-row">
            <div className="aurora-field">
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={aurora.textMuted.value}
                accessibilityLabel="Name"
              />
              {errors.name && (
                <Text style={styles.errorText}>⚠ {errors.name}</Text>
              )}
            </div>
            <div className="aurora-field">
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={aurora.textMuted.value}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email"
              />
              {errors.email && (
                <Text style={styles.errorText}>⚠ {errors.email}</Text>
              )}
            </div>
          </div>
        ) : (
          <>
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={aurora.textMuted.value}
              />
              {errors.name && (
                <Text style={styles.errorText}>⚠ {errors.name}</Text>
              )}
            </View>
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={aurora.textMuted.value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>⚠ {errors.email}</Text>
              )}
            </View>
          </>
        )}

        {/* Project type + Budget row */}
        {typeof window !== "undefined" ? (
          <div className="aurora-form-row" style={{ marginTop: 4 }}>
            <div className="aurora-field">
              <Text style={styles.label}>Project Type *</Text>
              <select
                className={`aurora-select${errors.projectType ? " error" : ""}`}
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                aria-required="true"
              >
                <option value="" disabled>
                  Select type
                </option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <Text style={styles.errorText}>⚠ {errors.projectType}</Text>
              )}
            </div>
            <div className="aurora-field">
              <Text style={styles.label}>
                Budget{" "}
                <span
                  style={{
                    color: aurora.textMuted.value,
                    fontWeight: "400",
                    fontSize: 10,
                  }}
                >
                  optional
                </span>
              </Text>
              <select
                className="aurora-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Select range</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Project Type *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.projectType ? styles.inputError : null,
                ]}
                value={projectType}
                onChangeText={setProjectType}
                placeholder="e.g. Web App"
                placeholderTextColor={aurora.textMuted.value}
              />
              {errors.projectType && (
                <Text style={styles.errorText}>⚠ {errors.projectType}</Text>
              )}
            </View>
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Budget (optional)</Text>
              <TextInput
                style={styles.input}
                value={budget}
                onChangeText={setBudget}
                placeholder="e.g. $5k–$15k"
                placeholderTextColor={aurora.textMuted.value}
              />
            </View>
          </>
        )}

        {/* Message */}
        {typeof window !== "undefined" ? (
          <div className="aurora-field">
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.message ? styles.inputError : null,
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell me about your project or idea..."
              placeholderTextColor={aurora.textMuted.value}
              multiline
              numberOfLines={5}
              accessibilityLabel="Message"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {errors.message ? (
                <Text style={styles.errorText}>⚠ {errors.message}</Text>
              ) : (
                <Text style={{ width: 1 }} />
              )}
              <Text style={styles.charCount}>{message.length} chars</Text>
            </View>
          </div>
        ) : (
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.message ? styles.inputError : null,
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell me about your project or idea..."
              placeholderTextColor={aurora.textMuted.value}
              multiline
              numberOfLines={5}
              accessibilityLabel="Message"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              {errors.message ? (
                <Text style={styles.errorText}>⚠ {errors.message}</Text>
              ) : (
                <Text style={{ width: 1 }} />
              )}
              <Text style={styles.charCount}>{message.length} chars</Text>
            </View>
          </View>
        )}

        {/* Submit */}
        <View style={styles.submitArea}>
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ActivityIndicator
                  color={aurora.deepSpace.value}
                  size="small"
                />
                <Text style={styles.submitText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.submitText}>Send Message →</Text>
            )}
          </Pressable>
          <Text style={styles.submitHint}>
            I&apos;ll reply within 24 hours.
          </Text>
        </View>
      </View>
    </View>
  );
}
