import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { useTraceability } from "@hooks/useTraceability";
import { INewTokenForm, ITokenInfo, UserRole } from "../../../interfaces";
import LoadingOverlay from "../../../layout/LoadingOverlay";
import CreateToken from "@components/Token/CreateToken";
import EmptyToken from "@components/Token/EmptyToken";
import TokenList from "@components/Token/TokenList";
import TokenHistory from "@components/Token/TokenHistory";

const Citizen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTokenForm, setShowCreateTokenForm] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ITokenInfo | null>(null);
  const [showTokenSummary, setShowTokenSummary] = useState(false);
  const [tokens, setTokens] = useState<ITokenInfo[]>([]);
  const { createToken, getTokensByUser, isServiceReady } = useTraceability();

  useEffect(() => {
    if (!isServiceReady) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const tokens = await getTokensByUser();
        setTokens(tokens);
      } catch (err) {
        alert(`Error al cargar los tokens: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  async function handleCreateToken(newToken: INewTokenForm) {
    if (!newToken || !createToken) return;
    try {
      setIsLoading(true);
      console.log("Creating token from Citizen component...", newToken);
      await createToken(newToken.name, newToken.total, newToken.additionalInfo);
      const tokens = await getTokensByUser();
      setTokens(tokens);
    } catch (error) {
      console.error("Error creating token:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleViewTokenDetails(token: ITokenInfo) {
    setSelectedToken(token);
    setShowTokenSummary(true);
  }

  return (
    <>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <LoadingOverlay loading={isLoading} />
        {tokens.length ? (
          <TokenList
            tokens={tokens}
            onAddToken={() => setShowCreateTokenForm(true)}
            onViewDetails={handleViewTokenDetails}
          />
        ) : (
          <EmptyToken onAddToken={() => setShowCreateTokenForm(true)} />
        )}
      </Container>
      {showCreateTokenForm && (
        <CreateToken
          role={UserRole.CITIZEN}
          open={showCreateTokenForm}
          onClose={() => setShowCreateTokenForm(false)}
          onCreate={handleCreateToken}
        />
      )}
      {showTokenSummary && selectedToken && (
        <TokenHistory
          token={selectedToken}
          onClose={() => setShowTokenSummary(false)}
        />
      )}
    </>
  );
};

export default Citizen;
