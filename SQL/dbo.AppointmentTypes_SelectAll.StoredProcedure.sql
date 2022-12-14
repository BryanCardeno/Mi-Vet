USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[AppointmentTypes_SelectAll]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Bryan Cardeno
-- Create date: September 22, 2022
-- Description: Get all appointment types
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE: 09/22/2022
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[AppointmentTypes_SelectAll]

AS

/*
-------- Test Code --------

EXECUTE dbo.AppointmentTypes_SelectAll
*/

BEGIN

	SELECT [Id]
			,[Name]
	FROM dbo.AppointmentTypes

END
GO
