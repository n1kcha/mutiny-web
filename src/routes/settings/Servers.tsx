import { createForm, custom, url } from "@modular-forms/solid";
import { createResource, Match, Suspense, Switch } from "solid-js";

import {
    BackLink,
    Button,
    Card,
    DefaultMain,
    ExternalLink,
    LargeHeader,
    LoadingShimmer,
    NavBar,
    NiceP,
    showToast,
    SimpleErrorDisplay,
    TextField
} from "~/components";
import { useI18n } from "~/i18n/context";
import {
    getSettings,
    MutinyWalletSettingStrings,
    setSettings
} from "~/logic/mutinyWalletSetup";
import { eify } from "~/utils";

const validateNotTorUrl = async (value?: string) => {
    if (!value) {
        return false;
    }

    // if it is one of the default URLs, it's safe
    // need this handling for self-hosting deployments
    if (
        value === import.meta.env.VITE_PROXY ||
        value === import.meta.env.VITE_ESPLORA ||
        value === import.meta.env.VITE_RGS ||
        value === import.meta.env.VITE_LSP ||
        value === import.meta.env.VITE_STORAGE
    ) {
        return true;
    }

    return !value.includes(".onion");
};

function SettingsStringsEditor(props: {
    initialSettings: MutinyWalletSettingStrings;
}) {
    const i18n = useI18n();
    const [settingsForm, { Form, Field }] =
        createForm<MutinyWalletSettingStrings>({
            initialValues: props.initialSettings
        });

    async function handleSubmit(values: MutinyWalletSettingStrings) {
        try {
            await setSettings(values);
            window.location.reload();
        } catch (e) {
            console.error(e);
            showToast(eify(e));
        }
        console.log(values);
    }

    return (
        <Card title={i18n.t("settings.servers.title")}>
            <Form onSubmit={handleSubmit} class="flex flex-col gap-4">
                <NiceP>{i18n.t("settings.servers.caption")}</NiceP>
                <ExternalLink href="https://github.com/MutinyWallet/mutiny-web/wiki/Self-hosting">
                    {i18n.t("settings.servers.link")}
                </ExternalLink>
                <div />
                <Field
                    name="proxy"
                    validate={[
                        url(i18n.t("settings.servers.error_proxy")),
                        custom(
                            validateNotTorUrl,
                            i18n.t("settings.servers.error_tor")
                        )
                    ]}
                >
                    {(field, props) => (
                        <TextField
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={i18n.t("settings.servers.proxy_label")}
                            caption={i18n.t("settings.servers.proxy_caption")}
                        />
                    )}
                </Field>
                <Field
                    name="esplora"
                    validate={[
                        url(i18n.t("settings.servers.error_esplora")),
                        custom(
                            validateNotTorUrl,
                            i18n.t("settings.servers.error_tor")
                        )
                    ]}
                >
                    {(field, props) => (
                        <TextField
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={i18n.t("settings.servers.esplora_label")}
                            caption={i18n.t("settings.servers.esplora_caption")}
                        />
                    )}
                </Field>
                <Field
                    name="rgs"
                    validate={[
                        url(i18n.t("settings.servers.error_rgs")),
                        custom(
                            validateNotTorUrl,
                            i18n.t("settings.servers.error_tor")
                        )
                    ]}
                >
                    {(field, props) => (
                        <TextField
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={i18n.t("settings.servers.rgs_label")}
                            caption={i18n.t("settings.servers.rgs_caption")}
                        />
                    )}
                </Field>
                <Field
                    name="lsp"
                    validate={[
                        url(i18n.t("settings.servers.error_lsp")),
                        custom(
                            validateNotTorUrl,
                            i18n.t("settings.servers.error_tor")
                        )
                    ]}
                >
                    {(field, props) => (
                        <TextField
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={i18n.t("settings.servers.lsp_label")}
                            caption={i18n.t("settings.servers.lsp_caption")}
                        />
                    )}
                </Field>
                <Field
                    name="storage"
                    validate={[
                        url(i18n.t("settings.servers.error_lsp")),
                        custom(
                            validateNotTorUrl,
                            i18n.t("settings.servers.error_tor")
                        )
                    ]}
                >
                    {(field, props) => (
                        <TextField
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={i18n.t("settings.servers.storage_label")}
                            caption={i18n.t("settings.servers.storage_caption")}
                        />
                    )}
                </Field>
                <div />
                <Button
                    type="submit"
                    disabled={!settingsForm.dirty}
                    intent="blue"
                >
                    {i18n.t("settings.servers.save")}
                </Button>
            </Form>
        </Card>
    );
}

function AsyncSettingsEditor() {
    const [settings] = createResource<MutinyWalletSettingStrings>(getSettings);

    return (
        <Switch>
            <Match when={settings.error}>
                <SimpleErrorDisplay error={settings.error} />
            </Match>
            <Match when={settings.latest}>
                <SettingsStringsEditor initialSettings={settings()!} />
            </Match>
        </Switch>
    );
}

export function Servers() {
    const i18n = useI18n();
    return (
        <DefaultMain>
            <BackLink href="/settings" title={i18n.t("settings.header")} />
            <LargeHeader>{i18n.t("settings.servers.title")}</LargeHeader>
            <Suspense fallback={<LoadingShimmer />}>
                <AsyncSettingsEditor />
            </Suspense>
            <NavBar activeTab="settings" />
        </DefaultMain>
    );
}
